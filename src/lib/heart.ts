export type Pt = [number, number]

const pt = (a: number): Pt => {
  const x = 16 * Math.pow(Math.sin(a), 3)
  const y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)
  return [50 + x * 2.45, 42 - y * 2.4]
}

export const heartPath = () =>
  Array.from({ length: 121 }, (_, i) => pt((i / 120) * Math.PI * 2))
    .map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1))
    .join('') + 'Z'

/** Một vòng điểm sáng, sắp theo tỉ lệ vàng để các điểm đầu tiên luôn phân bố đều. */
function ring(n: number, k: number, off: number): Pt[] {
  const a: Pt[] = []
  for (let i = 0; i < n; i++) {
    let p = pt((i / n) * 6.2832 + off)
    if (k !== 1) p = [50 + (p[0] - 50) * k, 45 + (p[1] - 45) * k]
    // Không đặt điểm trong vùng chữ 3DTV ở trung tâm
    if (k < 1 && Math.abs(p[0] - 50) < 26 && Math.abs(p[1] - 44) < 13) continue
    a.push(p)
  }
  return a
    .map((p, i) => ({ p, o: (i * 0.618) % 1 }))
    .sort((x, y) => x.o - y.o)
    .map((x) => x.p)
}

const RINGS = [ring(16, 1, 0.2), ring(12, 1.13, 0.55), ring(12, 0.62, 0.9)]

export function getSlots(cap: number): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < 16; i++) RINGS.forEach((r) => { if (r[i]) out.push(r[i]) })
  return out.slice(0, cap)
}
