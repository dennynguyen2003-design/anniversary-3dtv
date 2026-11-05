import { useEffect, useMemo, useRef, useState } from 'react'
import type { Wish } from '../types'
import { albumFiles } from '../data/albums'
import { computeHeartCollage, type HeartCollage } from '../lib/heart'
import { imgUrl } from '../lib/images'
import { aspectOf } from '../lib/photoSizes'

interface Props {
  wishes: Wish[]
  newId: string | null
  onOpen: (w: Wish) => void
  onOpenGallery: (title: string, files: string[], index: number) => void
}

const WIDE = '(min-width:960px)'

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches)
  useEffect(() => {
    const m = window.matchMedia(WIDE)
    const f = () => setWide(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return wide
}

function WishCard({ w, isNew, onOpen }: { w: Wish; isNew: boolean; onOpen: (w: Wish) => void }) {
  return (
    <button className={`wc${isNew ? ' new' : ''}`} onClick={() => onOpen(w)}>
      <b>{w.name}</b>
      <p>{w.text}</p>
      {w.text.length > 110 && <small>Xem thêm</small>}
    </button>
  )
}

export function HeartSection({ wishes, newId, onOpen, onOpenGallery }: Props) {
  const wide = useWide()
  const cap = wide ? 6 : 4
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(wishes.length / cap))
  const cur = Math.min(page, pages - 1)

  // Ảnh trong trái tim: ưu tiên nhóm khoảnh khắc 3DTV, sau đó các album tập thể khác
  const pool = useMemo(
    () => [...albumFiles('khoanh-khac-3dtv'), ...albumFiles('tap-the-2026'), ...albumFiles('noel-2025'), ...albumFiles('team-building')],
    [],
  )
  const boxRef = useRef<HTMLDivElement>(null)
  const [collage, setCollage] = useState<HeartCollage | null>(null)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    let t = 0
    const run = () => {
      const w = el.clientWidth
      if (w) setCollage(computeHeartCollage(w, pool, aspectOf))
    }
    run()
    const ro = new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(run, 120) })
    ro.observe(el)
    return () => { ro.disconnect(); clearTimeout(t) }
  }, [pool])

  // Lời chúc mới: chuyển tới đúng trang chứa nó
  useEffect(() => {
    if (!newId) return
    const idx = wishes.findIndex((w) => w.id === newId)
    if (idx >= 0) setPage(Math.floor(idx / cap))
  }, [newId, wishes, cap])

  const items = wishes.slice(cur * cap, cur * cap + cap)
  const left: Wish[] = []
  const right: Wish[] = []
  items.forEach((w, i) => (wide && i % 2 ? right : left).push(w))
  const tileFiles = collage?.tiles.map((t) => t.file) ?? []

  return (
    <section id="heartsec">
      <div className="wrap wide">
        <h2 className="h2">3DTV – <b>MÁI NHÀ CHUNG</b></h2>
        <p className="sub">WE ARE ONE</p>
        <div className="hw">
          <div className="hc" id="cl">
            {left.map((w) => <WishCard key={w.id} w={w} isNew={w.id === newId} onOpen={onOpen} />)}
          </div>
          <div className="heart" id="ht" ref={boxRef}>
            <svg viewBox={collage ? `0 0 ${collage.width} ${collage.height}` : '0 0 100 90'} aria-hidden="true">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2ED9EE" />
                  <stop offset="1" stopColor="#D5B56E" />
                </linearGradient>
              </defs>
              {collage && <path d={collage.path} fill="rgba(46,217,238,.05)" stroke="url(#g)" strokeWidth="2.5" strokeLinejoin="round" />}
            </svg>
            {collage?.tiles.map((t, i) => (
              <button
                key={t.file}
                className="ht"
                aria-label="Xem ảnh lớn"
                style={{ left: t.x, top: t.y, width: t.w, height: t.h, animationDelay: `${i * 70}ms` }}
                onClick={() => onOpenGallery('3DTV', tileFiles, i)}
              >
                <img src={imgUrl(t.file)} alt="" loading="lazy" decoding="async" draggable={false} />
              </button>
            ))}
          </div>
          <div className="hc" id="cr">
            {right.map((w) => <WishCard key={w.id} w={w} isNew={w.id === newId} onOpen={onOpen} />)}
          </div>
        </div>
        {wishes.length === 0 && <p className="em" id="em">Hãy là người đầu tiên gửi lời nhắn đến 3DTV.</p>}
        {pages > 1 && (
          <div className="pg" id="pg" style={{ display: 'flex' }}>
            <button aria-label="Trang trước" onClick={() => setPage(Math.max(0, cur - 1))}>‹</button>
            <span>{cur + 1} / {pages}</span>
            <button aria-label="Trang sau" onClick={() => setPage(Math.min(pages - 1, cur + 1))}>›</button>
          </div>
        )}
        <a className="btn gold" href="#send">Gửi thêm lời nhắn</a>
      </div>
    </section>
  )
}
