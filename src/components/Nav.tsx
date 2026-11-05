import { imgUrl, LOGO_FILE } from '../lib/images'

export function Nav() {
  return (
    <nav>
      <img className="logo" src={imgUrl(LOGO_FILE)} alt="3D Tech Vision" />
      <div className="l">
        <a href="#journey">Hành trình</a>
        <a href="#timeline">Timeline</a>
        <a href="#moments">Khoảnh khắc</a>
        <a href="#send">Lời nhắn</a>
      </div>
    </nav>
  )
}
