import { useEffect } from 'react'
import type { LightboxState } from '../types'
import { Photo } from './Photo'

interface Props {
  state: LightboxState
  onClose: () => void
  onIndex: (i: number) => void
}

export function Lightbox({ state, onClose, onIndex }: Props) {
  const { title, files, index } = state
  const n = files.length
  const mv = (d: number) => onIndex((index + d + n) % n)

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onIndex((index - 1 + n) % n)
      if (e.key === 'ArrowRight') onIndex((index + 1) % n)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [index, n, onClose, onIndex])

  return (
    <div className="lb open" id="lb" role="dialog" aria-modal="true" aria-label={title}>
      <div className="top">
        <b>{title}</b>
        <span style={{ color: 'var(--mut)', fontSize: 13 }}>{index + 1} / {n}</span>
        <button className="x" onClick={onClose} aria-label="Đóng">×</button>
      </div>
      <div className="main">
        <button className="nv" onClick={() => mv(-1)} aria-label="Ảnh trước">‹</button>
        <div className="stage">
          <Photo key={files[index]} file={files[index]} alt={`${title} – ảnh ${index + 1}`} eager />
        </div>
        <button className="nv" onClick={() => mv(1)} aria-label="Ảnh sau">›</button>
      </div>
      <div className="th">
        {files.map((f, j) => (
          <button key={f} className={j === index ? 'on' : ''} onClick={() => onIndex(j)} aria-label={`Ảnh ${j + 1}`}>{j + 1}</button>
        ))}
      </div>
    </div>
  )
}
