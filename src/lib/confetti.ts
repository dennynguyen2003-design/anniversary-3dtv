interface Particle { x: number; y: number; vx: number; vy: number; r: number; c: string; l: number; s: boolean }

const COLORS = ['#2ED9EE', '#D5B56E', '#F5F8FC', '#D5B56E']
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let dpr = 1
let particles: Particle[] = []
let raf = 0

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function resize() {
  if (!canvas) return
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
}

export function initConfetti(el: HTMLCanvasElement) {
  canvas = el
  ctx = el.getContext('2d')
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  resize()
  window.addEventListener('resize', resize)
  return () => {
    window.removeEventListener('resize', resize)
    cancelAnimationFrame(raf)
    raf = 0
    particles = []
    canvas = null
    ctx = null
  }
}

function tick() {
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  particles = particles.filter((p) => p.l > 0)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.vx *= 0.97
    p.vy = p.vy * 0.97 + 0.09
    p.l -= 0.014
    ctx.globalAlpha = Math.max(p.l, 0)
    ctx.fillStyle = p.c
    if (p.s) ctx.fillRect(p.x, p.y, p.r * 1.6, p.r * 0.7)
    else {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * 0.6, 0, 7)
      ctx.fill()
    }
  }
  raf = particles.length ? requestAnimationFrame(tick) : 0
  if (!raf) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
}

/** Pháo giấy nhẹ. Giảm còn rất ít hạt khi người dùng bật prefers-reduced-motion. */
export function burst(x: number, y: number, n = 24, speed = 1) {
  if (!ctx) return
  if (reduced()) n = Math.min(n, 6)
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.283
    const v = (2 + Math.random() * 4) * speed
    particles.push({
      x, y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 2 * speed,
      r: 2 + Math.random() * 3,
      c: COLORS[i % 4],
      l: 1,
      s: i % 2 === 1,
    })
  }
  if (!raf) raf = requestAnimationFrame(tick)
}
