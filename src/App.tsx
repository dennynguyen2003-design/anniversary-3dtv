import { useCallback, useState } from 'react'
import type { LightboxState, Wish } from './types'
import { useWishes } from './hooks/useWishes'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Journey } from './components/Journey'
import { Timeline } from './components/Timeline'
import { Behind } from './components/Behind'
import { Moments } from './components/Moments'
import { SendWish } from './components/SendWish'
import { HeartSection } from './components/HeartSection'
import { Lightbox } from './components/Lightbox'
import { WishPopup } from './components/WishPopup'
import { CornerToast } from './components/CornerToast'
import { ConfettiCanvas } from './components/ConfettiCanvas'
import { MusicToggle } from './components/MusicToggle'

export default function App() {
  const { wishes, submit } = useWishes()
  const [lb, setLb] = useState<LightboxState | null>(null)
  const [popup, setPopup] = useState<Wish | null>(null)
  const [newId, setNewId] = useState<string | null>(null)
  const [priority, setPriority] = useState<Wish | null>(null)
  const [momentsOpen, setMomentsOpen] = useState(false)
  const modalOpen = !!lb || !!popup

  const openGallery = useCallback((title: string, files: string[], index: number) => setLb({ title, files, index }), [])
  const closeGallery = useCallback(() => setLb(null), [])
  const setIndex = useCallback((index: number) => setLb((s) => (s ? { ...s, index } : s)), [])
  const closePopup = useCallback(() => setPopup(null), [])

  // Mở album khoảnh khắc bằng hiệu ứng mở nhẹ, rồi cuộn tới đầu phần album
  const explore = useCallback(() => {
    setMomentsOpen(true)
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => document.getElementById('moments')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' }), 250)
  }, [])

  const handleSubmit = async (input: { name: string; text: string }) => {
    const w = await submit(input)
    setNewId(w.id)
    setPriority(w)
    setTimeout(() => setNewId((c) => (c === w.id ? null : c)), 4500)
    return w
  }

  return (
    <>
      <Nav />
      <Hero />
      <Journey />
      <Timeline paused={modalOpen} onOpen={openGallery} />
      <Behind open={momentsOpen} onExplore={explore} />
      <Moments open={momentsOpen} paused={modalOpen} onOpen={openGallery} />
      <SendWish wishes={wishes} onSubmit={handleSubmit} />
      <HeartSection wishes={wishes} newId={newId} onOpen={setPopup} onOpenGallery={openGallery} />
      <footer>3D Tech Vision · Kỷ niệm 7 năm thành lập</footer>

      <CornerToast wishes={wishes} priority={priority} modalOpen={modalOpen} onOpen={setPopup} />
      {popup && <WishPopup wish={popup} onClose={closePopup} />}
      {lb && <Lightbox state={lb} onClose={closeGallery} onIndex={setIndex} />}
      <ConfettiCanvas />
      <MusicToggle />
    </>
  )
}
