// Stub: plugin system removed. All TUI components render directly.
import type { JSX } from "solid-js"

export function createTuiApi(_input: any): any {
  return {}
}

export type RouteMap = Map<string, any>

export const TuiPluginRuntime = {
  async init() {},
  async dispose() {},
  list() {
    return []
  },
  Slot(_props: { name: string; children?: JSX.Element }): JSX.Element | null {
    return null
  },
}
