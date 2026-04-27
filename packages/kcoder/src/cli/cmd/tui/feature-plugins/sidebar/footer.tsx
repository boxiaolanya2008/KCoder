import { createMemo, Show } from "solid-js"
import { Global } from "@kcoder/core/global"
import { useSync } from "../../context/sync"
import { useTheme } from "../../context/theme"
import { useKV } from "../../context/kv"
import { InstallationVersion } from "@kcoder/core/installation/version"

export function SidebarFooter() {
  const { theme } = useTheme()
  const sync = useSync()
  const kv = useKV()
  const has = createMemo(() =>
    sync.data.provider.some(
      (item) => item.id !== "kcoder" || Object.values(item.models).some((model) => model.cost?.input !== 0),
    ),
  )
  const done = createMemo(() => kv.get("dismissed_getting_started", false))
  const show = createMemo(() => !has() && !done())
  const path = createMemo(() => {
    const dir = sync.path.directory || process.cwd()
    const out = dir.replace(Global.Path.home, "~")
    const text = sync.data.vcs?.branch ? out + ":" + sync.data.vcs.branch : out
    const list = text.split("/")
    return {
      parent: list.slice(0, -1).join("/"),
      name: list.at(-1) ?? "",
    }
  })

  return (
    <box gap={1}>
      <Show when={show()}>
        <box
          backgroundColor={theme.backgroundElement}
          paddingTop={1}
          paddingBottom={1}
          paddingLeft={1}
          paddingRight={1}
          flexDirection="row"
          gap={1}
        >
          <text flexShrink={0} fg={theme.text}>
            ◆
          </text>
          <box flexGrow={1} gap={1}>
            <box flexDirection="row" justifyContent="space-between">
              <text fg={theme.text}>
                <b>Getting started</b>
              </text>
              <text fg={theme.textMuted} onMouseDown={() => kv.set("dismissed_getting_started", true)}>
                ✕
              </text>
            </box>
            <text fg={theme.textMuted}>KCoder includes free models so you can start immediately.</text>
            <box flexDirection="row" gap={1} justifyContent="space-between">
              <text fg={theme.text}>Connect provider</text>
              <text fg={theme.textMuted}>/connect</text>
            </box>
          </box>
        </box>
      </Show>
      <text>
        <span style={{ fg: theme.textMuted }}>{path().parent}/</span>
        <span style={{ fg: theme.text }}>{path().name}</span>
      </text>
      <text fg={theme.textMuted}>
        <span style={{ fg: theme.primary }}>●</span> KCoder {InstallationVersion}
      </text>
    </box>
  )
}
