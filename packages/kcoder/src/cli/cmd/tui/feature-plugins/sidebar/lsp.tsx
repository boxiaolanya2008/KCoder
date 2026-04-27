import { createMemo, For, Show, createSignal } from "solid-js"
import { useSync } from "../../context/sync"
import { useTheme } from "../../context/theme"

export function SidebarLsp() {
  const [open, setOpen] = createSignal(true)
  const { theme } = useTheme()
  const sync = useSync()
  const list = createMemo(() => sync.data.lsp)
  const off = createMemo(() => sync.data.config.lsp === false)

  return (
    <box>
      <box flexDirection="row" gap={1} onMouseDown={() => list().length > 2 && setOpen((x) => !x)}>
        <Show when={list().length > 2}>
          <text fg={theme.text}>{open() ? "▼" : "▶"}</text>
        </Show>
        <text fg={theme.text}>
          <b>LSP</b>
        </text>
      </box>
      <Show when={list().length <= 2 || open()}>
        <Show when={list().length === 0}>
          <text fg={theme.textMuted}>
            {off() ? "LSPs have been disabled in settings" : "LSPs will activate as files are read"}
          </text>
        </Show>
        <For each={list()}>
          {(item) => (
            <box flexDirection="row" gap={1}>
              <text
                flexShrink={0}
                style={{
                  fg: item.status === "connected" ? theme.success : theme.error,
                }}
              >
                •
              </text>
              <text fg={theme.textMuted}>
                {item.id} {item.root}
              </text>
            </box>
          )}
        </For>
      </Show>
    </box>
  )
}
