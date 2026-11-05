import { useEffect, useRef } from 'react'
import type { Wish } from '../types'

export function WishPopup({ wish, onClose }: { wish: Wish; onClose: () => void }) {
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    btn.current?.focus()
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div id="pp" className="open" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bx" role="dialog" aria-modal="true">
        <button className="cx" ref={btn} onClick={onClose} aria-label="Đóng">×</button>
        <h3>{wish.name}</h3>
        <p>{wish.text}</p>
      </div>
    </div>
  )
}
