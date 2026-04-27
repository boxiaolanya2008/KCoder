#!/usr/bin/env bun

import { $ } from "bun"
import { tmpdir } from "os"
import { join } from "path"

const FORK_REPO = "anomalyco/zed-extensions"
const UPSTREAM_REPO = "zed-industries/extensions"
const EXTENSION_NAME = "kcoder"

async function main() {
  const version = process.argv[2]
  if (!version) throw new Error("Version argument required, ex: bun script/sync-zed.ts v1.0.52")

  const token = process.env.ZED_EXTENSIONS_PAT
  if (!token) throw new Error("ZED_EXTENSIONS_PAT environment variable required")

  const prToken = process.env.ZED_PR_PAT
  if (!prToken) throw new Error("ZED_PR_PAT environment variable required")

  const cleanVersion = version.replace(/^v/, "")
  console.log(`üì¶ Syncing Zed extension for version ${cleanVersion}`)

  const commitSha = await $`git rev-parse ${version}`.text()
  const sha = commitSha.trim()
  console.log(`üîç Found commit SHA: ${sha}`)

  const extensionToml = await $`git show ${version}:packages/extensions/zed/extension.toml`.text()
  const parsed = Bun.TOML.parse(extensionToml) as { version: string }
  const extensionVersion = parsed.version

  if (extensionVersion !== cleanVersion) {
    throw new Error(`Version mismatch: extension.toml has ${extensionVersion} but tag is ${cleanVersion}`)
  }
  console.log(`‚ú?Version ${extensionVersion} matches tag`)

  // Clone the fork to a temp directory
  const workDir = join(tmpdir(), `zed-extensions-${Date.now()}`)
  console.log(`üìÅ Working in ${workDir}`)

  await $`git clone https://x-access-token:${token}@github.com/${FORK_REPO}.git ${workDir}`
  process.chdir(workDir)

  // Configure git identity
  await $`git config user.name "Aiden Cline"`
  await $`git config user.email "63023139+rekram1-node@users.noreply.github.com "`

  // Sync fork with upstream (force reset to match exactly)
  console.log(`üîÑ Syncing fork with upstream...`)
  await $`git remote add upstream https://github.com/${UPSTREAM_REPO}.git`
  await $`git fetch upstream`
  await $`git checkout main`
  await $`git reset --hard upstream/main`
  await $`git push origin main --force`
  console.log(`‚ú?Fork synced (force reset to upstream)`)

  // Create a new branch
  const branchName = `update-${EXTENSION_NAME}-${cleanVersion}`
  console.log(`üåø Creating branch ${branchName}`)
  await $`git checkout -b ${branchName}`

  const submodulePath = `extensions/${EXTENSION_NAME}`
  console.log(`üìå Updating submodule to commit ${sha}`)
  await $`git submodule update --init ${submodulePath}`
  process.chdir(submodulePath)
  await $`git fetch`
  await $`git checkout ${sha}`
  process.chdir(workDir)
  await $`git add ${submodulePath}`

  console.log(`üìù Updating extensions.toml`)
  const extensionsTomlPath = "extensions.toml"
  const extensionsToml = await Bun.file(extensionsTomlPath).text()

  const versionRegex = new RegExp(`(\\[${EXTENSION_NAME}\\][\\s\\S]*?)version = "[^"]+"`)
  const updatedToml = extensionsToml.replace(versionRegex, `$1version = "${cleanVersion}"`)

  if (updatedToml === extensionsToml) {
    throw new Error(`Failed to update version in extensions.toml - pattern not found`)
  }

  await Bun.write(extensionsTomlPath, updatedToml)
  await $`git add extensions.toml`

  const commitMessage = `Update ${EXTENSION_NAME} to v${cleanVersion}`

  await $`git commit -m ${commitMessage}`
  console.log(`‚ú?Changes committed`)

  // Delete any existing branches for kcoder updates
  console.log(`üîç Checking for existing branches...`)
  const branches = await $`git ls-remote --heads https://x-access-token:${token}@github.com/${FORK_REPO}.git`.text()
  const branchPattern = `refs/heads/update-${EXTENSION_NAME}-`
  const oldBranches = branches
    .split("\n")
    .filter((line) => line.includes(branchPattern))
    .map((line) => line.split("refs/heads/")[1])
    .filter(Boolean)

  if (oldBranches.length > 0) {
    console.log(`üóëÔ∏? Found ${oldBranches.length} old branch(es), deleting...`)
    for (const branch of oldBranches) {
      await $`git push https://x-access-token:${token}@github.com/${FORK_REPO}.git --delete ${branch}`
      console.log(`‚ú?Deleted branch ${branch}`)
    }
  }

  console.log(`üöÄ Pushing to fork...`)
  await $`git push https://x-access-token:${token}@github.com/${FORK_REPO}.git ${branchName}`

  console.log(`üì¨ Creating pull request...`)
  const prResult =
    await $`gh pr create --repo ${UPSTREAM_REPO} --base main --head ${FORK_REPO.split("/")[0]}:${branchName} --title "Update ${EXTENSION_NAME} to v${cleanVersion}" --body "Updating kcoder extension to v${cleanVersion}"`
      .env({ ...process.env, GH_TOKEN: prToken })
      .nothrow()

  if (prResult.exitCode !== 0) {
    console.error("stderr:", prResult.stderr.toString())
    throw new Error(`Failed with exit code ${prResult.exitCode}`)
  }

  const prUrl = prResult.stdout.toString().trim()
  console.log(`‚ú?Pull request created: ${prUrl}`)
  console.log(`üéâ Done!`)
}

main().catch((err) => {
  console.error("‚ù?Error:", err.message)
  process.exit(1)
})
