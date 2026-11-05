import sizes from '../data/photoSizes.json'

/**
 * Kích thước thật (rộng, cao) của các ảnh khoảnh khắc, dùng để giữ đúng tỷ lệ khi xếp
 * dải ảnh chạy ngang và trái tim ghép ảnh (không bóp méo, không giật bố cục khi ảnh tải).
 * Thêm ảnh mới vào nhóm album thì thêm cặp [rộng, cao] vào src/data/photoSizes.json;
 * nếu chưa có, hệ thống tạm dùng tỷ lệ 3:2.
 */
const map = sizes as unknown as Record<string, [number, number]>

export const sizeOf = (file: string): [number, number] | undefined => map[file]
export const aspectOf = (file: string): number => {
  const s = map[file]
  return s ? s[0] / s[1] : 1.5
}
