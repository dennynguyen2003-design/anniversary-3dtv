# 3D Tech Vision – Website kỷ niệm 7 năm

React + Vite + TypeScript. Giao diện, nội dung, hiệu ứng và chức năng giữ nguyên theo bản demo đã duyệt.

## Cách đặt vào repository `3dtv-anniversary`

Ảnh đang nằm ở **thư mục gốc** repository. Giải nén ZIP rồi chép **nội dung** thư mục `3dtv-anniversary/`
(không chép thư mục bao ngoài) vào **thư mục gốc** repo, cạnh các file ảnh. Không đổi tên hay di chuyển ảnh.
Khi chép sẽ thay file `README.md` cũ (chỉ có 18 byte).

```
3dtv-anniversary/            <- gốc repo
├─ hero-banner.jpg, LOGO3d.png, 2019-…jpg, …   (ảnh gốc, giữ nguyên)
├─ package.json, index.html, vite.config.ts, tsconfig.json, vercel.json
├─ scripts/copy-images.mjs   (sao chép ảnh vào public/images khi dev/build)
└─ src/
```

## Ảnh

- `scripts/copy-images.mjs` chạy tự động trước `npm run dev` và `npm run build`.
- Script chỉ sao chép các file khai báo trong `src/data/manifest.json` (đã đối chiếu với 78 ảnh thực tế trong repo)
  vào `public/images`, **giữ nguyên tên file**, kể cả chữ hoa/thường (ví dụ `.JPG` của `cleft-summit`).
- Thiếu hoặc sai chữ hoa/thường ở bất kỳ file nào thì build dừng và liệt kê tên file lỗi.
- `public/images` được `.gitignore`, không cần commit bản sao.
- Thêm/bớt ảnh: sửa `src/data/manifest.json` (tên file phải trùng đúng với ảnh trong repo).
- Chạy riêng: `npm run images`.

## Chạy thử

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # kiểm tra kiểu + build ra dist/
npm run preview
```

## Triển khai Vercel

1. Đẩy repo lên GitHub, vào Vercel chọn **Add New → Project** và import repo.
2. Vercel tự nhận Vite. Cấu hình đã có trong `vercel.json` (build: `npm run build`, output: `dist`).
3. Deploy. Mỗi lần push lên `main` sẽ tự build lại.

Lưu ý: ảnh gốc rất nặng (tổng khoảng 224 MB; `smart-healthcare` 14–17 MB/ảnh, `hero-banner.jpg` 8,3 MB).
Trang chỉ tải ảnh đang xem và ảnh kế tiếp trong slideshow, nhưng nên có thêm bản ảnh đã nén cho website
trước khi công bố rộng rãi để trang tải nhanh hơn, nhất là trên mobile.

## Cấu trúc mã nguồn

- `src/data/` – timeline (`events.ts`), album (`albums.ts`), câu gợi ý lời chúc, `manifest.json` (tên ảnh).
- `src/components/` – các phần của trang (Hero, Timeline, Moments, SendWish, HeartSection, CornerToast…).
- `src/lib/confetti.ts` – pháo giấy nhẹ (giảm còn rất ít hạt khi bật reduced motion).
- `src/lib/wishesService.ts` – lớp dữ liệu lời chúc.

## Lời chúc: demo và bản chính thức

Hiện lời chúc chỉ lưu trong bộ nhớ của phiên xem (mất khi tải lại trang, không đồng bộ cho người khác);
form có ghi rõ chế độ demo. Để lưu thật (ví dụ Supabase):

1. Tạo bảng `wishes` (`id`, `name`, `text`, `created_at`, `approved boolean default false`) và bật RLS: cho phép
   `insert` công khai, chỉ `select` các dòng `approved = true`.
2. Viết thêm một service trong `src/lib/wishesService.ts` theo giao diện `WishesService` (`list`, `submit`) và chọn nó
   khi `VITE_WISHES_BACKEND=supabase`; khai báo biến môi trường theo `.env.example` trên Vercel.
3. Thêm chống spam (giới hạn gửi, captcha) và trang duyệt lời chúc; có thể dùng Supabase Realtime để cập nhật tức thời.
