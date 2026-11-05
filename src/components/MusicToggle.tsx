import { useEffect, useRef, useState } from 'react'
import '../styles/music.css'

const SRC = '/audio/nhac-nen-3dtv.mp3'
const VOLUME = 0.2

type AudioCtor = typeof AudioContext

/**
 * Nhạc nền: mặc định tắt, bật khi người xem bấm nút, âm lượng 20%, lặp liên tục.
 * Tắt = tạm dừng, bật lại = tiếp tục từ vị trí cũ. Component nằm ngoài các section nên
 * nhạc không bị ngắt khi cuộn trang hay mở lightbox/popup.
 * Âm lượng đặt qua GainNode vì iOS Safari bỏ qua audio.volume.
 */
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const a = audioRef.current
    return () => {
      a?.pause()
      void ctxRef.current?.close()
      ctxRef.current = null
    }
  }, [])

  const setupVolume = () => {
    const a = audioRef.current
    if (!a || ctxRef.current) return
    const Ctor: AudioCtor | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext
    if (!Ctor) {
      a.volume = VOLUME
      return
    }
    try {
      const ctx = new Ctor()
      const gain = ctx.createGain()
      gain.gain.value = VOLUME
      ctx.createMediaElementSource(a).connect(gain)
      gain.connect(ctx.destination)
      ctxRef.current = ctx
    } catch {
      a.volume = VOLUME
    }
  }

  const toggle = async () => {
    const a = audioRef.current
    if (!a) return
    if (!a.paused) {
      a.pause()
      return
    }
    try {
      setupVolume()
      if (ctxRef.current?.state === 'suspended') await ctxRef.current.resume()
      await a.play()
      setFailed(false)
    } catch {
      setFailed(true)
    }
  }

  const label = failed ? 'Không phát được nhạc nền' : playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'

  return (
    <>
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        className={`mu${playing ? ' on' : ''}${failed ? ' err' : ''}`}
        aria-pressed={playing}
        aria-label={label}
        title={label}
        onClick={toggle}
      >
        <svg className="mu-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V5l11-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
        </svg>
        <span className="mu-eq" aria-hidden="true"><i /><i /><i /></span>
      </button>
    </>
  )
}
