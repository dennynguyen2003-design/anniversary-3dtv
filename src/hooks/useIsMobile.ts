import { useEffect, useState } from 'react'

export function useIsMobile(breakpoint = 640) {
  const [m, setM] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    let t = 0
    const f = () => { clearTimeout(t); t = window.setTimeout(() => setM(window.innerWidth < breakpoint), 150) }
    window.addEventListener('resize', f)
    return () => { window.removeEventListener('resize', f); clearTimeout(t) }
  }, [breakpoint])
  return m
}
