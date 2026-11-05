import { useReveal } from '../hooks/useReveal'

export function Journey() {
  const [ref, v] = useReveal<HTMLDivElement>()
  return (
    <section id="journey">
      <div ref={ref} className={`glass intro rv${v ? ' in' : ''}`}>
        <h2 className="h2">HÀNH TRÌNH <b>7 NĂM</b></h2>
        <p>Bảy năm là một chặng đường với những dấu mốc phát triển, những trải nghiệm đáng nhớ và sự đồng hành của tập thể 3D Tech Vision.</p>
        <p>Từ những nền tảng đầu tiên đến các hoạt động nghiên cứu, ứng dụng công nghệ và kết nối chuyên môn, mỗi bước đi đều góp phần tạo nên 3DTV của hôm nay.</p>
        <p>Nhân dịp kỷ niệm 7 năm thành lập, hãy cùng nhìn lại những dấu ấn đã góp phần tạo nên hành trình ấy.</p>
        <a className="btn" href="#timeline">Khám phá những dấu mốc</a>
      </div>
    </section>
  )
}
