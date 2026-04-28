import { createContext, createMemo, useContext, type ParentProps, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { useTheme } from "@tui/context/theme"
import { useTerminalDimensions } from "@opentui/solid"
import { SplitBorder } from "../component/border"
import { RGBA, TextAttributes } from "@opentui/core"
import { Schema } from "effect"
import { TuiEvent } from "../event"
import { useKV } from "../context/kv"
import { createAppear } from "../util/signal"

type ToastInput = Schema.Codec.Encoded<typeof TuiEvent.ToastShow.properties>
export type ToastOptions = Schema.Schema.Type<typeof TuiEvent.ToastShow.properties>

const decodeToastOptions = Schema.decodeUnknownSync(TuiEvent.ToastShow.properties)

export function Toast() {
  const toast = useToast()
  const { theme } = useTheme()
  const dimensions = useTerminalDimensions()
  const kv = useKV()
  const enabled = createMemo(() => kv.get("animations_enabled", true))
  const appear = createAppear(enabled, 220)

  const slideTop = createMemo(() => 2 - (1 - appear()) * 1.5)
  const bgAlpha = createMemo(() => {
    const p = appear()
    return RGBA.fromValues(
      theme.backgroundPanel.r,
      theme.backgroundPanel.g,
      theme.backgroundPanel.b,
      Math.round(theme.backgroundPanel.a * p),
    )
  })

  return (
    <Show when={toast.currentToast}>
      {(current) => (
        <box
          position="absolute"
          justifyContent="center"
          alignItems="flex-start"
          top={slideTop()}
          right={2}
          maxWidth={Math.min(60, dimensions().width - 6)}
          paddingLeft={2}
          paddingRight={2}
          paddingTop={1}
          paddingBottom={1}
          backgroundColor={bgAlpha()}
          borderColor={theme[current().variant]}
          border={["left", "right"]}
          customBorderChars={SplitBorder.customBorderChars}
        >
          <Show when={current().title}>
            <text attributes={TextAttributes.BOLD} marginBottom={1} fg={theme.text}>
              {current().title}
            </text>
          </Show>
          <text fg={theme.text} wrapMode="word" width="100%">
            {current().message}
          </text>
        </box>
      )}
    </Show>
  )
}

function init() {
  const [store, setStore] = createStore({
    currentToast: null as ToastOptions | null,
  })

  let timeoutHandle: NodeJS.Timeout | null = null

  const toast = {
    show(options: ToastInput) {
      const toastOptions = decodeToastOptions(options)
      setStore("currentToast", toastOptions)
      if (timeoutHandle) clearTimeout(timeoutHandle)
      timeoutHandle = setTimeout(() => {
        setStore("currentToast", null)
      }, toastOptions.duration).unref()
    },
    error: (err: any) => {
      if (err instanceof Error)
        return toast.show({
          variant: "error",
          message: err.message,
        })
      toast.show({
        variant: "error",
        message: "An unknown error has occurred",
      })
    },
    get currentToast(): ToastOptions | null {
      return store.currentToast
    },
  }
  return toast
}

export type ToastContext = ReturnType<typeof init>

const ctx = createContext<ToastContext>()

export function ToastProvider(props: ParentProps) {
  const value = init()
  return <ctx.Provider value={value}>{props.children}</ctx.Provider>
}

export function useToast() {
  const value = useContext(ctx)
  if (!value) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return value
}
