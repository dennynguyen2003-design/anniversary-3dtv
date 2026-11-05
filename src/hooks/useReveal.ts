import { useEffect, useRef, useState } from 'react'

/** Hiện dần phần tử khi cuộn tới (class "rv" -> "rv in"). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible] as const
}
