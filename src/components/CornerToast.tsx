import { useEffect, useRef, useState } from 'react'
import type { Wish } from '../types'

interface Props {
  wishes: Wish[]
  /** Lời chúc vừa gửi: được ưu tiên hiển thị một lần. */
  priority: Wish | null
  /** Đang mở popup hoặc lightbox: tạm ẩn thẻ. */
  modalOpen: boolean
  onOpen: (w: Wish) => void
}

/** Thẻ lời chúc luân phiên ở góc màn hình: mỗi lần một thẻ, ~7 giây, nghỉ ngắn rồi tới thẻ kế tiếp. */
export function CornerToast({ wishes, priority, modalOpen, onOpen }: Props) {
  const [shown, setShown] = useState<Wish | null>(null)
  const [on, setOn] = useState(false)
  const S = useRef({
    wishes, modalOpen, closed: false, hover: false, on: false, cp: 0, lastW: null as Wish | null,
    lastT: 0, formVisible: false, queue: [] as Wish[], tm: 0, loop: () => {},
  })
  S.current.wishes = wishes
  S.current.modalOpen = modalOpen

  useEffect(() => {
    const s = S.current
    const mobile = () => window.innerWidth < 640
    const blocked = () => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName ?? ''
      return s.closed || !s.wishes.length || document.hidden || s.modalOpen || /^(INPUT|TEXTAREA)$/.test(tag) || (mobile() && s.formVisible)
    }
    const next = (): Wish | null => {
      if (s.queue.length) return s.queue.shift()!
      const W = s.wishes
      if (!W.length || (W.length === 1 && Date.now() - s.lastT < 25000)) return null
      let w = W[s.cp++ % W.length]
      if (w === s.lastW && W.length > 1) w = W[s.cp++ % W.length]
      return w
    }
    const hide = () => {
      clearTimeout(s.tm)
      s.on = false
      setOn(false)
      s.tm = window.setTimeout(loop, s.wishes.length > 1 ? 3000 : 20000)
    }
    const stay = () => { s.tm = window.setTimeout(() => (s.hover ? stay() : hide()), 7000) }
    function loop() {
      if (blocked()) { s.tm = window.setTimeout(loop, 1500); return }
      const w = next()
      if (!w) { s.tm = window.setTimeout(loop, 2500); return }
      s.lastW = w
      s.lastT = Date.now()
      s.on = true
      setShown(w)
      setOn(true)
      stay()
    }
    s.loop = loop

    const form = document.getElementById('f')
    const io = form ? new IntersectionObserver((x) => { s.formVisible = x[0].isIntersecting }) : null
    if (form && io) io.observe(form)
    const monitor = window.setInterval(() => { if (s.on && blocked()) hide() }, 500)
    s.tm = window.setTimeout(loop, 3000)
    return () => { clearTimeout(s.tm); clearInterval(monitor); io?.disconnect() }
  }, [])

  // Lời chúc mới: xếp hàng ưu tiên, hiện sau khi trang cuộn tới trái tim
  useEffect(() => {
    if (!priority) return
    const s = S.current
    s.queue.push(priority)
    if (!s.on) { clearTimeout(s.tm); s.tm = window.setTimeout(s.loop, 2400) }
  }, [priority])

  const close = () => {
    const s = S.current
    s.closed = true
    clearTimeout(s.tm)
    s.on = false
    setOn(false)
  }

  return (
    <div id="cn" className={on ? 'on' : ''} aria-live="polite"
      onMouseEnter={() => { S.current.hover = true }} onMouseLeave={() => { S.current.hover = false }}>
      <button className="cx" onClick={close} aria-label="Đóng">×</button>
      <div className="in" onClick={() => shown && onOpen(shown)}>
        <b><span>♥</span><em>{shown?.name}</em></b>
        <p>{shown?.text}</p>
        {shown && shown.text.length > 90 && <small>Xem thêm</small>}
      </div>
    </div>
  )
}
