import { useProject } from "@tui/context/project"
import { useSync } from "@tui/context/sync"
import { createMemo, Show } from "solid-js"
import { useTheme } from "../../context/theme"
import { useTuiConfig } from "../../context/tui-config"
import { getScrollAcceleration } from "../../util/scroll"
import { SidebarContext } from "../../feature-plugins/sidebar/context"
import { SidebarMcp } from "../../feature-plugins/sidebar/mcp"
import { SidebarLsp } from "../../feature-plugins/sidebar/lsp"
import { SidebarTodo } from "../../feature-plugins/sidebar/todo"
import { SidebarFiles } from "../../feature-plugins/sidebar/files"
import { SidebarFooter } from "../../feature-plugins/sidebar/footer"

export function Sidebar(props: { sessionID: string; overlay?: boolean }) {
  const project = useProject()
  const sync = useSync()
  const { theme } = useTheme()
  const tuiConfig = useTuiConfig()
  const session = createMemo(() => sync.session.get(props.sessionID))
  const workspaceStatus = () => {
    const workspaceID = session()?.workspaceID
    if (!workspaceID) return "error"
    return project.workspace.status(workspaceID) ?? "error"
  }
  const workspaceLabel = () => {
    const workspaceID = session()?.workspaceID
    if (!workspaceID) return "unknown"
    const info = project.workspace.get(workspaceID)
    if (!info) return "unknown"
    return `${info.type}: ${info.name}`
  }
  const scrollAcceleration = createMemo(() => getScrollAcceleration(tuiConfig))

  return (
    <Show when={session()}>
      <box
        backgroundColor={theme.backgroundPanel}
        width={38}
        height="100%"
        paddingTop={1}
        paddingBottom={1}
        paddingLeft={1}
        paddingRight={1}
        position={props.overlay ? "absolute" : "relative"}
      >
        <scrollbox
          flexGrow={1}
          scrollAcceleration={scrollAcceleration()}
          verticalScrollbarOptions={{
            trackOptions: {
              backgroundColor: theme.background,
              foregroundColor: theme.border,
            },
          }}
        >
          <box flexShrink={0} gap={1} paddingRight={1}>
            <box paddingRight={1}>
              <text fg={theme.text}>
                <b>{session()!.title}</b>
              </text>
              <Show when={session()!.workspaceID}>
                <text fg={theme.textMuted}>
                  <span style={{ fg: workspaceStatus() === "connected" ? theme.success : theme.error }}>●</span>{" "}
                  {workspaceLabel()}
                </text>
              </Show>
            </box>
            <SidebarContext sessionID={props.sessionID} />
            <SidebarMcp />
            <SidebarLsp />
            <SidebarTodo sessionID={props.sessionID} />
            <SidebarFiles sessionID={props.sessionID} />
          </box>
        </scrollbox>

        <box flexShrink={0} gap={1} paddingTop={1}>
          <SidebarFooter />
        </box>
      </box>
    </Show>
  )
}
