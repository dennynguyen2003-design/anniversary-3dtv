import manifest from './manifest.json'
import type { TimelineEvent } from '../types'

/** Nội dung timeline đã duyệt. Tên file ảnh lấy từ manifest.json (khớp repository). */
const m = manifest.events as Record<string, { cover: string | null; gallery: string[] }>

const base: { id: string; date: string; title: string; description: string }[] = [
  {
    "id": "thanh-lap",
    "date": "19/11/2019",
    "title": "THÀNH LẬP 3D TECH VISION",
    "description": "Thành lập Công ty 3D Tech Vision, đặt nền tảng cho hành trình nghiên cứu và ứng dụng công nghệ 3D trong lĩnh vực y tế."
  },
  {
    "id": "videc-2024",
    "date": "22–24/08/2024",
    "title": "VIDEC 2024",
    "description": "Tham gia Hội nghị Khoa học và Triển lãm Răng Hàm Mặt Quốc tế – VIDEC 2024."
  },
  {
    "id": "trien-lam",
    "date": "13–15/10/2025",
    "title": "TRIỂN LÃM SẢN PHẨM CÔNG NGHỆ CHIẾN LƯỢC QUỐC GIA",
    "description": "Tham gia trưng bày tại Triển lãm Sản phẩm Công nghệ Chiến lược Quốc gia, trong khuôn khổ Đại hội đại biểu Đảng bộ TP.HCM lần thứ I, nhiệm kỳ 2025–2030."
  },
  {
    "id": "hidec-2025",
    "date": "07–09/11/2025",
    "title": "HIDEC 2025",
    "description": "Tham gia Hội nghị Khoa học và Triển lãm Răng Hàm Mặt Quốc tế TP.HCM lần thứ III – HIDEC 2025."
  },
  {
    "id": "hue",
    "date": "31/12/2025",
    "title": "SINH HOẠT KHOA HỌC VỀ ỨNG DỤNG CÔNG NGHỆ 3D",
    "description": "Đồng hành tại chương trình sinh hoạt khoa học “Ứng dụng công nghệ 3D trong y học tại Việt Nam” do Bệnh viện Trung ương Huế tổ chức."
  },
  {
    "id": "long-hau",
    "date": "03/2026",
    "title": "ĐƯA VÀO HOẠT ĐỘNG XƯỞNG IN 3D LONG HẬU",
    "description": "Hoàn tất thi công và đưa vào hoạt động xưởng in 3D tại Khu công nghiệp Long Hậu."
  },
  {
    "id": "smart-healthcare",
    "date": "08/04/2026",
    "title": "SMART HEALTHCARE 2026",
    "description": "Tham gia Smart Healthcare 2026 – Startup Connection Day, giới thiệu các sản phẩm và giải pháp công nghệ 3D trong y tế."
  },
  {
    "id": "ham-mat",
    "date": "22–23/05/2026",
    "title": "HỘI NGHỊ PHẪU THUẬT MIỆNG HÀM MẶT VÀ TẠO HÌNH",
    "description": "Tham gia Hội nghị Khoa học Phẫu thuật Miệng Hàm Mặt và Tạo hình Việt Nam trong kỷ nguyên số."
  },
  {
    "id": "cleft-summit",
    "date": "21–23/09/2026",
    "title": "INTERNATIONAL CLEFT MASTERY SUMMIT 2026",
    "description": "Tham gia hội nghị quốc tế International Cleft Mastery Summit 2026 tại Hà Nội."
  },
  {
    "id": "ky-niem-7-nam",
    "date": "19/11/2026",
    "title": "KỶ NIỆM 7 NĂM THÀNH LẬP 3D TECH VISION",
    "description": "7 năm kiến tạo và phát triển – Tiếp nối những giá trị."
  }
]

export const events: TimelineEvent[] = base.map((e) => ({
  ...e,
  cover: m[e.id].cover ?? undefined,
  gallery: m[e.id].gallery,
}))
