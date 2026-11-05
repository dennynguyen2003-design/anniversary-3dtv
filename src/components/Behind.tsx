import { useReveal } from '../hooks/useReveal'

export function Behind() {
  const [ref, v] = useReveal<HTMLDivElement>()
  return (
    <section id="behind">
      <div ref={ref} className={`wrap rv${v ? ' in' : ''}`}>
        <h2 className="h2">PHÍA SAU NHỮNG <b>DẤU MỐC</b></h2>
        <p>Mỗi cột mốc trên hành trình 7 năm của 3D Tech Vision đều được tạo nên từ những nỗ lực, sự tận tâm và tinh thần đồng hành của cả một tập thể.</p>
        <p>Đằng sau những dự án, những hoạt động chuyên môn và những bước tiến trong quá trình phát triển là những con người đã cùng nhau làm việc, sẻ chia và vượt qua những thử thách.</p>
        <p>Và bên cạnh những dấu ấn trong công việc, hành trình ấy còn lưu giữ nhiều kỷ niệm, những tiếng cười và khoảnh khắc gắn kết của đại gia đình 3DTV.</p>
        <p>Hãy cùng nhìn lại những khoảnh khắc đáng nhớ ấy.</p>
      </div>
    </section>
  )
}
