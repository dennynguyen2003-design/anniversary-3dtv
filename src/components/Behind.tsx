import { useReveal } from '../hooks/useReveal'

interface Props {
  open: boolean
  onExplore: () => void
}

/** Phần chuyển tiếp sau timeline: album khoảnh khắc chỉ mở khi người xem bấm nút. */
export function Behind({ open, onExplore }: Props) {
  const [ref, v] = useReveal<HTMLDivElement>()
  return (
    <section id="bridge">
      <div ref={ref} className={`bridge rv${v ? ' in' : ''}`}>
        <h2 className="h2">PHÍA SAU NHỮNG <b>DẤU MỐC</b></h2>
        <p>Bên cạnh những dấu ấn trên hành trình phát triển, 3DTV còn lưu giữ nhiều khoảnh khắc đáng nhớ của các thành viên.</p>
        <p>Đó là những kỷ niệm, những tiếng cười và những phút giây gắn kết đã góp phần tạo nên đại gia đình 3D Tech Vision hôm nay.</p>
        <p>Hãy cùng nhìn lại những khoảnh khắc ấy.</p>
        <button type="button" className="btn gold" aria-expanded={open} aria-controls="ow" onClick={onExplore}>
          Khám phá những khoảnh khắc
        </button>
      </div>
    </section>
  )
}
