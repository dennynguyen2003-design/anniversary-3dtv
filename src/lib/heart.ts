export interface HeartTile { file: string; x: number; y: number; w: number; h: number }
export interface HeartCollage { width: number; height: number; path: string; tiles: HeartTile[] }

type Pt = [number, number]
type Seg = [number, number]

/** Các đoạn nằm trong đa giác P tại đường ngang y. */
function ints(P: Pt[], y: number): Seg[] {
  const x: number[] = []
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length]
    if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) x.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]))
  }
  x.sort((p, q) => p - q)
  const r: Seg[] = []
  for (let i = 0; i + 1 < x.length; i += 2) r.push([x[i], x[i + 1]])
  return r
}

function isx(A: Seg[], B: Seg[]): Seg[] {
  const r: Seg[] = []
  A.forEach((a) => B.forEach((b) => {
    const l = Math.max(a[0], b[0]), h = Math.min(a[1], b[1])
    if (h - l > 1) r.push([l, h])
  }))
  return r.sort((p, q) => p[0] - q[0])
}

/** Vùng ngang nằm trọn trong đa giác suốt chiều cao của một hàng. */
function band(P: Pt[], y0: number, y1: number): Seg[] {
  let r = ints(P, y0 + 0.5)
  for (let s = 1; s <= 12; s++) r = isx(r, ints(P, y0 + ((y1 - y0) * s) / 12))
  return isx(r, ints(P, y1 - 0.5))
}

function minSeg(P: Pt[], y: number): number {
  const r = ints(P, y)
  return r.length ? Math.min(...r.map((a) => a[1] - a[0])) : 0
}

/** Chọn 1–4 ảnh (trong 6 ảnh kế tiếp) sao cho hàng được lấp đầy với mức cắt mép nhỏ nhất. */
function fill(c: string[], w: number, h: number, g: number, aspectOf: (f: string) => number) {
  const res: { best: { sel: string[]; s: number; cost: number } | null } = { best: null }
  const rec = (sel: string[]) => {
    if (sel.length) {
      const sa = sel.reduce((s, f) => s + aspectOf(f), 0)
      const s = (w - (sel.length - 1) * g) / (sa * h)
      const cost = Math.abs(Math.log(s))
      if (!res.best || cost < res.best.cost) res.best = { sel: sel.slice(), s, cost }
    }
    if (sel.length < 4) c.forEach((f) => { if (!sel.includes(f)) rec([...sel, f]) })
  }
  rec([])
  return res.best
}

/**
 * Trái tim ghép ảnh thật: các hàng ảnh giữ đúng tỷ lệ, nằm gọn trong vùng thụt vào so với viền tim
 * (luôn có khoảng đệm với đường viền, ảnh không đè lên viền).
 */
export function computeHeartCollage(bw: number, pool: string[], aspectOf: (f: string) => number): HeartCollage {
  const bh = bw * 0.9
  const sx = (bw * 0.92) / 32
  const cx = bw / 2
  const raw: Pt[] = []
  let ymax = -99, ymin = 99
  for (let i = 0; i <= 180; i++) {
    const a = (i / 180) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(a), 3)
    const y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)
    raw.push([x, y])
    ymax = Math.max(ymax, y)
    ymin = Math.min(ymin, y)
  }
  const top = (bh - (ymax - ymin) * sx) / 2
  const P: Pt[] = raw.map((p) => [cx + p[0] * sx, top + (ymax - p[1]) * sx])
  const cy = top + (ymax + 2) * sx
  const K = 0.9
  const Q: Pt[] = P.map((p) => [cx + (p[0] - cx) * K, cy + (p[1] - cy) * K])
  const yT = Math.min(...Q.map((p) => p[1]))
  const yB = Math.max(...Q.map((p) => p[1]))
  const R = bw < 430 ? 4 : 5
  const g = bw < 430 ? 4 : 5
  let h = (yB - yT) / (R + 1)
  let yS = yT, yE = yB
  for (let n = 0; n < 4; n++) {
    yS = yT
    while (yS < yB && minSeg(Q, yS) < 1.1 * h) yS += 2
    yE = yB
    while (yE > yS && minSeg(Q, yE) < 1.05 * h) yE -= 2
    h = (yE - yS - (R - 1) * g) / R
  }
  const used: string[] = []
  const tiles: HeartTile[] = []
  for (let r = 0; r < R; r++) {
    const y0 = yS + r * (h + g)
    band(Q, y0, y0 + h).forEach((seg) => {
      const sg: Seg = [seg[0] + 3, seg[1] - 3]
      const w = sg[1] - sg[0]
      if (w < 0.9 * h) return
      const b = fill(pool.filter((f) => !used.includes(f)).slice(0, 6), w, h, g, aspectOf)
      if (!b || b.cost > 0.3) return
      let x = sg[0]
      b.sel.forEach((f) => {
        const tw = aspectOf(f) * h * b.s
        tiles.push({ file: f, x, y: y0, w: tw, h })
        used.push(f)
        x += tw + g
      })
    })
  }
  const path = P.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('') + 'Z'
  return { width: bw, height: bh, path, tiles }
}
