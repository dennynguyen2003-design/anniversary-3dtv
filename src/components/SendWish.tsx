import { useRef, useState, type FormEvent } from 'react'
import type { Wish } from '../types'
import { SUGGESTIONS } from '../data/suggestions'
import { burst } from '../lib/confetti'
import { IS_DEMO } from '../lib/wishesService'

interface Props {
  wishes: Wish[]
  onSubmit: (input: { name: string; text: string }) => Promise<Wish>
}

export function SendWish({ wishes, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<{ t: string; err: boolean }>({ t: '', err: false })
  const [sending, setSending] = useState(false)
  const sendingRef = useRef(false)
  const si = useRef(-1)

  const suggest = () => {
    si.current = (si.current + 1 + Math.floor(Math.random() * (SUGGESTIONS.length - 1))) % SUGGESTIONS.length
    setText(SUGGESTIONS[si.current])
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (sendingRef.current) return
    const n = name.trim().replace(/\s+/g, ' ')
    const m = text.trim()
    if (!n) return setStatus({ t: 'Bạn hãy nhập tên hiển thị hoặc biệt danh.', err: true })
    if (m.length < 5) return setStatus({ t: 'Lời chúc cần có ít nhất vài chữ nhé.', err: true })
    if (wishes.some((w) => w.name === n && w.text === m)) return setStatus({ t: 'Lời nhắn này đã được gửi rồi.', err: true })

    sendingRef.current = true
    setSending(true)
    try {
      await onSubmit({ name: n, text: m })
      setStatus({
        t: 'Cảm ơn bạn! Lời nhắn đã được thêm vào trái tim.' + (IS_DEMO ? ' (Chế độ demo: chưa đồng bộ cho người khác.)' : ''),
        err: false,
      })
      setText('')
      ;(document.activeElement as HTMLElement | null)?.blur()
      burst(window.innerWidth / 2, window.innerHeight * 0.6, 50)
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setTimeout(() => document.getElementById('heartsec')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' }), 600)
    } catch {
      setStatus({ t: 'Chưa gửi được lời nhắn. Vui lòng thử lại.', err: true })
    } finally {
      sendingRef.current = false
      setSending(false)
    }
  }

  return (
    <section id="send" style={{ background: 'linear-gradient(var(--bg),var(--bg2))' }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <h2 className="h2">GỬI MỘT LỜI NHẮN <b>ĐẾN 3DTV</b></h2>
        <p style={{ maxWidth: 700, margin: '0 auto 12px' }}>Nhân dịp kỷ niệm 7 năm thành lập, hãy dành một lời chúc, lời cảm ơn hoặc đôi dòng gửi gắm đến 3D Tech Vision nhé.</p>
        <p style={{ maxWidth: 700, margin: '0 auto' }}>Mỗi lời nhắn đều là một tình cảm đáng quý, góp phần lưu giữ những kỷ niệm đẹp trên hành trình của đại gia đình 3DTV.</p>
        <form className="glass" id="f" style={{ textAlign: 'left' }} onSubmit={submit} noValidate>
          <label>Tên hiển thị
            <input id="nm" value={name} maxLength={40} placeholder="Tên của bạn" autoComplete="off" onChange={(e) => setName(e.target.value)} />
          </label>
          <label>Lời chúc
            <textarea id="ms" value={text} maxLength={500} placeholder="Viết lời chúc của bạn…" onChange={(e) => setText(e.target.value)} />
          </label>
          <div className="row">
            <button type="button" className="btn sm" onClick={suggest}>Gợi ý lời chúc</button>
            <button type="button" className="btn sm" onClick={suggest}>Xem câu khác</button>
            <button type="submit" className="btn sm gold" style={{ marginLeft: 'auto' }} disabled={sending}>
              {sending ? 'Đang gửi…' : 'Gửi lời chúc'}
            </button>
          </div>
          <p className={`toast${status.err ? ' err' : ''}`} role="status">{status.t}</p>
        </form>
      </div>
    </section>
  )
}
