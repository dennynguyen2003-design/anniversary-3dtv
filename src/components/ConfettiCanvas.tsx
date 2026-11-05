import { useEffect, useRef } from 'react'
import { initConfetti } from '../lib/confetti'

export function ConfettiCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => (ref.current ? initConfetti(ref.current) : undefined), [])
  return <canvas id="fx" ref={ref} aria-hidden="true" />
}
