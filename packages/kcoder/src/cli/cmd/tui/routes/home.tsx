import { Prompt, type PromptRef } from "@tui/component/prompt"
import { createEffect, createSignal } from "solid-js"
import { useProject } from "../context/project"
import { useSync } from "../context/sync"
import { Toast } from "../ui/toast"
import { useArgs } from "../context/args"
import { useRouteData } from "@tui/context/route"
import { usePromptRef } from "../context/prompt"
import { useLocal } from "../context/local"
import { useTheme } from "../context/theme"
import { HomeFooter } from "../feature-plugins/home/footer"
import { logo } from "@/cli/logo"

let once = false
const placeholder = {
  normal: ["How do I fix this bug?", "Explain this codebase", "Write a test for this function"],
  shell: ["ls -la", "git status", "pwd"],
}

export function Home() {
  const sync = useSync()
  const project = useProject()
  const route = useRouteData("home")
  const promptRef = usePromptRef()
  const [ref, setRef] = createSignal<PromptRef | undefined>()
  const args = useArgs()
  const local = useLocal()
  const { theme } = useTheme()
  let sent = false

  const bind = (r: PromptRef | undefined) => {
    setRef(r)
    promptRef.set(r)
    if (once || !r) return
    if (route.prompt) {
      r.set(route.prompt)
      once = true
      return
    }
    if (!args.prompt) return
    r.set({ input: args.prompt, parts: [] })
    once = true
  }

  createEffect(() => {
    const r = ref()
    if (sent) return
    if (!r) return
    if (!sync.ready || !local.model.ready) return
    if (!args.prompt) return
    if (r.current.input !== args.prompt) return
    sent = true
    r.submit()
  })

  return (
    <>
      <box flexGrow={1} flexDirection="column" height="100%" alignItems="center" paddingLeft={4} paddingRight={4}>
        <box flexGrow={1} minHeight={0} />
        <box flexShrink={0} alignItems="center" gap={1}>
          <box flexDirection="column" alignItems="center">
            {logo.left.map((line, i) => (
              <text fg={theme.primary}>
                {line}{" "}{logo.right[i] ?? ""}
              </text>
            ))}
          </box>
          <text fg={theme.textMuted}>AI coding assistant</text>
        </box>
        <box height={2} minHeight={0} />
        <box width="100%" maxWidth={75} flexShrink={0}>
          <Prompt
            ref={bind}
            workspaceID={project.workspace.current()}
            placeholders={placeholder}
          />
        </box>
        <box flexGrow={1} minHeight={0} />
        <Toast />
      </box>
      <box width="100%" flexShrink={0}>
        <HomeFooter />
      </box>
    </>
  )
}
