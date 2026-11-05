import { useEffect, useRef } from 'react'
import { albumFiles } from '../data/albums'
import { burst } from '../lib/confetti'
import { imgUrl } from '../lib/images'
import { sizeOf } from '../lib/photoSizes'
import { useReveal } from '../hooks/useReveal'

interface Props {
  open: boolean
  /** Đang mở lightbox/popup: dải ảnh tạm dừng chạy. */
  paused: boolean
  onOpen: (title: string, files: string[], index: number) => void
}

const TITLE = '3DTV'
const speed = () => (window.innerWidth < 700 ? 28 : 42) // px/giây, chậm hơn trên điện thoại

/**
 * Dải ảnh chạy ngang liền mạch. Ảnh giữ đúng tỷ lệ (chiều cao cố định, chiều rộng theo ảnh).
 * Nội dung được lặp 3 lần để nối tiếp không lộ khoảng trống; người xem vẫn vuốt/cuộn tay được.
 */
function Strip({ files, dir, paused, onOpen }: { files: string[]; dir: 1 | -1; paused: boolean; onOpen: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const grp = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let pos: number | null = null
    let last = 0
    let hold = 0
    let hov = false
    let vis = false
    let init = false
    let raf = 0
    const gw = () => grp.current?.offsetWidth ?? 0

    const enter = () => { hov = true }
    const leave = () => { hov = false }
    const touch = () => { hold = performance.now() + 2500 } // chạm/vuốt: nghỉ 2,5 giây rồi chạy tiếp
    const onScroll = () => {
      const g = gw()
      if (!g) return
      if (el.scrollLeft < g) el.scrollLeft += g
      else if (el.scrollLeft >= 2 * g) el.scrollLeft -= g
    }
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    el.addEventListener('touchstart', touch, { passive: true })
    el.addEventListener('pointerdown', touch, { passive: true })
    el.addEventListener('wheel', touch, { passive: true })
    el.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver((x) => { vis = x[0].isIntersecting })
    io.observe(el)

    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0)
      last = t
      const g = gw()
      if (g && !init && vis) { el.scrollLeft = g; init = true }
      if (g && init && vis && !hov && t > hold && !reduced && !pausedRef.current) {
        if (pos === null || Math.abs(pos - el.scrollLeft) > 2) pos = el.scrollLeft
        pos += dir * speed() * dt
        el.scrollLeft = pos
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
      el.removeEventListener('touchstart', touch)
      el.removeEventListener('pointerdown', touch)
      el.removeEventListener('wheel', touch)
      el.removeEventListener('scroll', onScroll)
    }
  }, [dir])

  return (
    <div className="mq" ref={ref}>
      <div className="tk">
        {[0, 1, 2].map((c) => (
          <div className="grp" key={c} ref={c === 0 ? grp : undefined} aria-hidden={c ? true : undefined}>
            {files.map((f, i) => {
              const s = sizeOf(f)
              return (
                <button key={f} className="it" tabIndex={c ? -1 : 0} aria-label="Xem ảnh lớn" onClick={() => onOpen(i)}>
                  <img src={imgUrl(f)} alt="" width={s?.[0]} height={s?.[1]} loading="lazy" decoding="async" draggable={false} />
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Moments({ open, paused, onOpen }: Props) {
  const [ref, v] = useReveal<HTMLDivElement>()
  // Dải 1: 13 ảnh khoảnh khắc 3DTV; dải 2: Team building, Noel 2025 và ảnh tập thể
  const row1 = albumFiles('khoanh-khac-3dtv')
  const row2 = [...albumFiles('team-building'), ...albumFiles('noel-2025'), ...albumFiles('tap-the-2026')]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return
        io.disconnect()
        burst(window.innerWidth * 0.25, window.innerHeight * 0.5, 40)
        burst(window.innerWidth * 0.75, window.innerHeight * 0.5, 40)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  return (
    <div className={`ow${open ? ' on' : ''}`} id="ow" aria-hidden={!open}>
      <div className="oi">
        <section id="moments">
          <div className="wrap">
            <h2 className="h2">NHỮNG KHOẢNH KHẮC <b>ĐÁNG NHỚ</b></h2>
            <div className="mqs" id="mqs">
              <Strip files={row1} dir={1} paused={paused} onOpen={(i) => onOpen(TITLE, row1, i)} />
              <Strip files={row2} dir={-1} paused={paused} onOpen={(i) => onOpen(TITLE, row2, i)} />
            </div>
            <div ref={ref} className={`glass thanks rv${v ? ' in' : ''}`}>
              <h3>7 NĂM – CẢM ƠN VÌ ĐÃ <span style={{ color: 'var(--au)' }}>ĐỒNG HÀNH</span></h3>
              <p>Bảy năm qua, mỗi thành viên đều góp phần tạo nên những câu chuyện và dấu ấn riêng trên hành trình phát triển của 3D Tech Vision.</p>
              <p style={{ margin: 0 }}>Cảm ơn những nỗ lực, sự sẻ chia và tinh thần đồng hành đã góp phần tạo nên đại gia đình 3DTV hôm nay.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
