import { useEffect, useMemo, useState } from 'react'
import type { Wish } from '../types'
import { getSlots, heartPath } from '../lib/heart'
import { useIsMobile } from '../hooks/useIsMobile'

interface Props {
  wishes: Wish[]
  newId: string | null
  onOpen: (w: Wish) => void
}

export function HeartSection({ wishes, newId, onOpen }: Props) {
  const mobile = useIsMobile()
  const cap = mobile ? 12 : 24
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(wishes.length / cap))
  const cur = Math.min(page, pages - 1)
  const slots = useMemo(() => getSlots(cap), [cap])
  const d = useMemo(heartPath, [])

  // Lời chúc mới: chuyển tới đúng trang chứa nó
  useEffect(() => {
    if (!newId) return
    const idx = wishes.findIndex((w) => w.id === newId)
    if (idx >= 0) setPage(Math.floor(idx / cap))
  }, [newId, wishes, cap])

  return (
    <section id="heartsec">
      <div className="wrap">
        <h2 className="h2">3DTV – <b>MÁI NHÀ CHUNG</b></h2>
        <p className="sub">WE ARE ONE</p>
        <div className="heart" id="ht">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2ED9EE" />
                <stop offset="1" stopColor="#D5B56E" />
              </linearGradient>
            </defs>
            <path d={d} fill="rgba(46,217,238,.07)" stroke="url(#g)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="c">3DTV</div>
          {slots.map((p, i) => {
            const w = wishes[cur * cap + i]
            const pos = { left: `${p[0]}%`, top: `${p[1]}%` }
            if (!w) return <i key={`s${i}`} className="sp" style={{ ...pos, animationDelay: `${i * 0.4}s` }} />
            const isNew = w.id === newId
            return (
              <button
                key={w.id}
                className={`dot${isNew ? ' new' : ''}`}
                title={w.name}
                aria-label={`Lời nhắn của ${w.name}`}
                style={isNew ? pos : { ...pos, animationDelay: `${i * 0.3}s` }}
                onClick={() => onOpen(w)}
              />
            )
          })}
        </div>
        {wishes.length === 0 && <p className="em" id="em">Hãy là người đầu tiên gửi lời nhắn đến 3DTV.</p>}
        {pages > 1 && (
          <div className="pg" id="pg" style={{ display: 'flex' }}>
            <button aria-label="Trang trước" onClick={() => setPage(Math.max(0, cur - 1))}>‹</button>
            <span>{cur + 1} / {pages}</span>
            <button aria-label="Trang sau" onClick={() => setPage(Math.min(pages - 1, cur + 1))}>›</button>
          </div>
        )}
        {wishes.length > 0 && (
          <div className="all" id="al" style={{ display: 'grid' }}>
            {wishes.slice().reverse().map((w) => (
              <button key={w.id} title={w.name} onClick={() => onOpen(w)}>{w.name}</button>
            ))}
          </div>
        )}
        <a className="btn gold" href="#send">Gửi thêm lời nhắn</a>
      </div>
    </section>
  )
}
