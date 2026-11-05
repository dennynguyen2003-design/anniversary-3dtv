import type { Wish } from '../types'

/**
 * Lớp dữ liệu lời chúc.
 * - Bản demo: lưu trong bộ nhớ của phiên xem (mất khi tải lại trang, KHÔNG đồng bộ cho người khác).
 * - Bản chính thức: viết thêm một service dùng Supabase (xem README) với cùng giao diện
 *   và chọn nó khi VITE_WISHES_BACKEND=supabase.
 */
export interface WishesService {
  /** Lấy các lời chúc đã được lưu và cho phép hiển thị. */
  list(): Promise<Wish[]>
  /** Lưu một lời chúc mới, ném lỗi nếu thất bại. */
  submit(input: { name: string; text: string }): Promise<Wish>
}

export const IS_DEMO = import.meta.env.VITE_WISHES_BACKEND !== 'supabase'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const demoService: WishesService = {
  async list() {
    return []
  },
  async submit({ name, text }) {
    await sleep(700)
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      text,
      createdAt: Date.now(),
    }
  },
}

export const wishesService: WishesService = demoService
