export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  /** Ảnh đại diện (file có hậu tố -cover). Mốc chưa có ảnh thì để trống. */
  cover?: string
  /** Các ảnh còn lại của sự kiện, theo thứ tự tên file tăng dần. */
  gallery: string[]
}

export interface Wish {
  id: string
  name: string
  text: string
  createdAt: number
}

export interface LightboxState {
  title: string
  files: string[]
  index: number
}
