import { useEffect } from 'react'
import { albums } from '../data/albums'
import { burst } from '../lib/confetti'
import { useReveal } from '../hooks/useReveal'
import { Photo } from './Photo'

interface Props {
  onOpen: (title: string, files: string[], index: number) => void
}

function Album({ title, files, onOpen }: { title: string; files: string[]; onOpen: Props['onOpen'] }) {
  const [ref, v] = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`alb rv${v ? ' in' : ''}`}>
      <h3>{title}</h3>
      <div className="grid">
        {files.map((f, i) => (
          <button key={f} className="thumb" aria-label={`${title} – ảnh ${i + 1}`} onClick={() => onOpen(title, files, i)}>
            <Photo file={f} alt={title} fit="cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export function Moments({ onOpen }: Props) {
  const [ref, v] = useReveal<HTMLDivElement>()

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
    <section id="moments">
      <div className="wrap">
        <h2 className="h2">NHỮNG KHOẢNH KHẮC <b>ĐÁNG NHỚ</b></h2>
        <div id="albums">
          {albums.map((a) => <Album key={a.id} title={a.title} files={a.files} onOpen={onOpen} />)}
        </div>
        <div ref={ref} className={`glass thanks rv${v ? ' in' : ''}`}>
          <h3>7 NĂM – CẢM ƠN VÌ ĐÃ <span style={{ color: 'var(--au)' }}>ĐỒNG HÀNH</span></h3>
          <p>Bảy năm qua, mỗi thành viên đều góp phần tạo nên những câu chuyện và dấu ấn riêng trên hành trình phát triển của 3D Tech Vision.</p>
          <p style={{ margin: 0 }}>Cảm ơn những nỗ lực, sự sẻ chia và tinh thần đồng hành đã góp phần tạo nên đại gia đình 3DTV hôm nay.</p>
        </div>
      </div>
    </section>
  )
}
