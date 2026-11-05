import manifest from '../data/manifest.json'

/** Ảnh được sao chép vào public/images bởi scripts/copy-images.mjs, giữ nguyên tên file gốc. */
export const imgUrl = (file: string) => `/images/${encodeURIComponent(file)}`
export const HERO_FILE: string = manifest.hero
export const LOGO_FILE: string = manifest.logo
