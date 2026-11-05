import { useState } from 'react'
import { imgUrl } from '../lib/images'

interface Props {
  file: string
  alt?: string
  fit?: 'cover' | 'contain'
  eager?: boolean
  className?: string
}

/** Hiển thị đúng file ảnh trong repository; nếu tải lỗi thì hiện khung chờ ghi tên file (không thay bằng ảnh khác). */
export function Photo({ file, alt = '', fit, eager, className }: Props) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className="ph"><span>{file}</span></div>
  return (
    <img
      className={className}
      src={imgUrl(file)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={fit ? { objectFit: fit } : undefined}
      onError={() => setFailed(true)}
    />
  )
}
