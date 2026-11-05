
// Sao chép ảnh từ thư mục gốc repository vào public/images (giữ nguyên tên file).
// - Chỉ sao chép các file khai báo trong src/data/manifest.json.
// - So khớp tên file theo đúng chữ hoa/chữ thường (an toàn khi build trên Linux/Vercel).
// - Nếu thiếu file nào, build sẽ dừng và liệt kê tên file còn thiếu.
// Dùng: node scripts/copy-images.mjs [--allow-missing]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/data/manifest.json'), 'utf8'))
const dest = path.join(root, 'public/images')
const allowMissing = process.argv.includes('--allow-missing')

const wanted = new Set([manifest.hero, manifest.logo])
for (const e of Object.values(manifest.events)) {
  if (e.cover) wanted.add(e.cover)
  e.gallery.forEach((f) => wanted.add(f))
}
for (const list of Object.values(manifest.albums)) list.forEach((f) => wanted.add(f))

// Nơi tìm ảnh: thư mục gốc repo (ưu tiên), sau đó public/images nếu đã có sẵn.
const sources = [root, dest].filter((d) => fs.existsSync(d))
const index = new Map() // tên file chính xác -> đường dẫn
for (const dir of sources) {
  for (const name of fs.readdirSync(dir)) {
    if (!index.has(name) && fs.statSync(path.join(dir, name)).isFile()) index.set(name, path.join(dir, name))
  }
}

fs.mkdirSync(dest, { recursive: true })
const missing = []
let copied = 0
for (const name of wanted) {
  const src = index.get(name)
  if (!src) { missing.push(name); continue }
  const out = path.join(dest, name)
  if (path.resolve(src) === path.resolve(out)) continue
  if (fs.existsSync(out) && fs.statSync(out).size === fs.statSync(src).size) continue
  fs.copyFileSync(src, out)
  copied++
}

const lower = new Map([...index.keys()].map((n) => [n.toLowerCase(), n]))
if (missing.length) {
  console.error(`\n[images] Thiếu ${missing.length} file:`)
  for (const m of missing) {
    const near = lower.get(m.toLowerCase())
    console.error(`  - ${m}${near ? `  (có file "${near}" nhưng khác chữ hoa/thường)` : ''}`)
  }
  if (!allowMissing) process.exit(1)
}
console.log(`[images] ${wanted.size - missing.length}/${wanted.size} ảnh sẵn sàng trong public/images (đã sao chép ${copied}).`)
