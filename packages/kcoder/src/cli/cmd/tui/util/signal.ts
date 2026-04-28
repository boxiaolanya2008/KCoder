import { createEffect, createSignal, on, onCleanup, onMount, type Accessor } from "solid-js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"

export function createDebouncedSignal<T>(value: T, ms: number): [Accessor<T>, Scheduled<[value: T]>] {
  const [get, set] = createSignal(value)
  return [get, debounce((v: T) => set(() => v), ms)]
}

// smoothstep: 比线性更自然的缓动，开头结尾都比较柔和
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

// easeOutCubic: 快速启动，缓慢结束，适合进入动画
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

export function createFadeIn(show: Accessor<boolean>, enabled: Accessor<boolean>) {
  const [alpha, setAlpha] = createSignal(show() ? 1 : 0)
  let revealed = show()

  createEffect(
    on([show, enabled], ([visible, animate]) => {
      if (!visible) {
        setAlpha(0)
        return
      }

      if (!animate || revealed) {
        revealed = true
        setAlpha(1)
        return
      }

      const start = performance.now()
      revealed = true
      setAlpha(0)

      const timer = setInterval(() => {
        const progress = Math.min((performance.now() - start) / 160, 1)
        setAlpha(smoothstep(progress))
        if (progress >= 1) clearInterval(timer)
      }, 16)

      onCleanup(() => clearInterval(timer))
    }),
  )

  return alpha
}

/**
 * 组件挂载时的出现动画，返回一个 0->1 的进度值
 * 适合给列表项、消息等加进入效果
 * @param duration 动画时长(ms)，默认 200
 * @param delay 延迟(ms)，默认 0
 */
export function createAppear(enabled: Accessor<boolean>, duration = 200, delay = 0) {
  const [progress, setProgress] = createSignal(1)

  onMount(() => {
    if (!enabled()) return
    setProgress(0)

    const start = performance.now() + delay

    const timer = setInterval(() => {
      const now = performance.now()
      if (now < start) return
      const p = Math.min((now - start) / duration, 1)
      setProgress(easeOutCubic(p))
      if (p >= 1) clearInterval(timer)
    }, 16)

    onCleanup(() => clearInterval(timer))
  })

  return progress
}

/**
 * 从 from 值动画到 to 值的通用工具
 * 适合需要数值过渡的场景（margin、padding、alpha 等）
 */
export function createAnimatedValue(
  from: number,
  to: number,
  enabled: Accessor<boolean>,
  duration = 200,
  delay = 0,
) {
  const [value, setValue] = createSignal(enabled() ? to : from)

  onMount(() => {
    if (!enabled()) {
      setValue(to)
      return
    }
    setValue(from)

    const start = performance.now() + delay

    const timer = setInterval(() => {
      const now = performance.now()
      if (now < start) return
      const p = Math.min((now - start) / duration, 1)
      const eased = easeOutCubic(p)
      setValue(from + (to - from) * eased)
      if (p >= 1) clearInterval(timer)
    }, 16)

    onCleanup(() => clearInterval(timer))
  })

  return value
}
