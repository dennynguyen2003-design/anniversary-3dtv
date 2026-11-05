import type { MouseEvent } from 'react'
import { burst } from '../lib/confetti'
import { HERO_FILE, imgUrl } from '../lib/images'

export function Hero() {
  const onCta = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    burst(r.left + r.width / 2, r.top, 40)
  }
  return (
    <section id="hero">
      <img className="hero-img" src={imgUrl(HERO_FILE)} alt="Poster kỷ niệm 7 năm thành lập 3D Tech Vision" loading="eager" {...{ fetchpriority: 'high' }} decoding="async" />
      <a className="btn" href="#journey" onClick={onCta}>Cùng nhìn lại hành trình</a>
    </section>
  )
}
