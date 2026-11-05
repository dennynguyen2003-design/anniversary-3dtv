import { useEffect, useRef, useState } from 'react'
import { events } from '../data/events'
import type { TimelineEvent } from '../types'
import { burst } from '../lib/confetti'
import { useReveal } from '../hooks/useReveal'
import { Photo } from './Photo'

interface ItemProps {
  ev: TimelineEvent
  k: number
  big: boolean
  paused: boolean
  onOpen: (title: string, files: string[], index: number) => void
}

function EventItem({ ev, k, big, paused, onOpen }: ItemProps) {
  const files = ev.cover ? [ev.cover, ...ev.gallery] : []
  const n = files.length
  const [ref, visible] = useReveal<HTMLDivElement>()
  const slRef = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const [inView, setInView] = useState(false)
  const [seen, setSeen] = useState<number[]>([0])
  const hover = useRef(false)
  const holdUntil = useRef(0)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  // Chỉ chạy slideshow khi đang nằm trong màn hình
  useEffect(() => {
    const el = slRef.current
    if (!el) return
    const io = new IntersectionObserver((e) => setInView(e[0].isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Tự chuyển ảnh sau mỗi 3 giây; tạm dừng khi hover, chạm/bấm, mở lightbox/popup hoặc tab bị ẩn
  useEffect(() => {
    if (!inView || n < 2) return
    const t = setInterval(() => {
      if (hover.current || pausedRef.current || document.hidden || Date.now() < holdUntil.current) return
      setI((x) => (x + 1) % n)
    }, 3000)
    return () => clearInterval(t)
  }, [inView, n])

  // Chỉ tải ảnh hiện tại và ảnh kế tiếp (ảnh sự kiện có thể rất nặng)
  useEffect(() => {
    if (!n) return
    setSeen((s) => Array.from(new Set([...s, i, (i + 1) % n])))
  }, [i, n])

  // Pháo giấy nhẹ khi cuộn tới mốc (lớn hơn ở mốc đầu và mốc cuối)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer = 0
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return
        io.disconnect()
        const r = el.getBoundingClientRect()
        const px = window.innerWidth > 760 ? (k % 2 ? r.left : r.right) : r.left + 8
        timer = window.setTimeout(() => burst(px, r.top + 32, big ? 60 : 14, big ? 1.2 : 0.6), 400)
      },
      { threshold: 0.45 },
    )
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(timer) }
  }, [k, big, ref])

  const hold = () => { holdUntil.current = Date.now() + 8000 }
  const go = (d: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setI((x) => (x + d + n) % n)
    hold()
  }
  const open = () => { if (n) onOpen(ev.title, files, i) }

  return (
    <div ref={ref} className={`ev rv${visible ? ' in' : ''}`}>
      <div
        className={`card glass${n ? '' : ' nopic'}`}
        role={n ? 'button' : undefined}
        tabIndex={n ? 0 : undefined}
        onClick={open}
        onKeyDown={(e) => { if (e.key === 'Enter') open() }}
      >
        {n ? (
          <div
            className="sl"
            ref={slRef}
            onMouseEnter={() => { hover.current = true }}
            onMouseLeave={() => { hover.current = false }}
            onTouchStart={hold}
          >
            {files.map((f, idx) => (
              <div key={f} className={`sd${idx === i ? ' on' : ''}`}>
                {seen.includes(idx) && <Photo file={f} alt={ev.title} fit="contain" eager={idx === 0 && k < 2} />}
              </div>
            ))}
            {n > 1 && (
              <>
                <button className="ar p" aria-label="Ảnh trước" onClick={go(-1)}>‹</button>
                <button className="ar n" aria-label="Ảnh sau" onClick={go(1)}>›</button>
                <div className="dt">{files.map((f, idx) => <i key={f} className={idx === i ? 'on' : ''} />)}</div>
              </>
            )}
          </div>
        ) : null}
        <div className="bd">
          <div className="date">{ev.date}</div>
          <h3>{ev.title}</h3>
          <p>{ev.description}</p>
          {n > 0 && <button className="btn sm" tabIndex={-1}>Xem hình ảnh sự kiện</button>}
        </div>
      </div>
    </div>
  )
}

export function Timeline(props: { paused: boolean; onOpen: ItemProps['onOpen'] }) {
  return (
    <section id="timeline">
      <div className="wrap">
        <h2 className="h2">2019 – <b>2026</b></h2>
        <div className="tl">
          {events.map((ev, k) => (
            <EventItem key={ev.id} ev={ev} k={k} big={k === 0 || k === events.length - 1} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
