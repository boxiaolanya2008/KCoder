import { createMemo, Match, Show, Switch } from "solid-js"
import { Global } from "@kcoder/core/global"
import { useSync } from "../../context/sync"
import { useTheme } from "../../context/theme"
import { InstallationVersion } from "@kcoder/core/installation/version"

function Directory() {
  const { theme } = useTheme()
  const sync = useSync()
  const dir = createMemo(() => {
    const d = sync.path.directory || process.cwd()
    const out = d.replace(Global.Path.home, "~")
    const branch = sync.data.vcs?.branch
    if (branch) return out + ":" + branch
    return out
  })

  return <text fg={theme.textMuted}>{dir()}</text>
}

function Mcp() {
  const { theme } = useTheme()
  const sync = useSync()
  const list = createMemo(() =>
    Object.entries(sync.data.mcp)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, item]) => ({ name, status: item.status, error: item.status === "failed" ? item.error : undefined })),
  )
  const has = createMemo(() => list().length > 0)
  const err = createMemo(() => list().some((item) => item.status === "failed"))
  const count = createMemo(() => list().filter((item) => item.status === "connected").length)

  return (
    <Show when={has()}>
      <box gap={1} flexDirection="row" flexShrink={0}>
        <text fg={theme.text}>
          <Switch>
            <Match when={err()}>
              <span style={{ fg: theme.error }}>● </span>
            </Match>
            <Match when={true}>
              <span style={{ fg: count() > 0 ? theme.success : theme.textMuted }}>● </span>
            </Match>
          </Switch>
          {count()} MCP
        </text>
      </box>
    </Show>
  )
}

export function HomeFooter() {
  const { theme } = useTheme()
  return (
    <box
      width="100%"
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
      paddingRight={2}
      flexDirection="row"
      flexShrink={0}
      gap={2}
    >
      <Directory />
      <Mcp />
      <box flexGrow={1} />
      <text fg={theme.textMuted}>KCoder {InstallationVersion}</text>
    </box>
  )
}
