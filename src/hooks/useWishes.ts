import { useCallback, useEffect, useState } from 'react'
import type { Wish } from '../types'
import { wishesService } from '../lib/wishesService'

export function useWishes() {
  const [wishes, setWishes] = useState<Wish[]>([])

  useEffect(() => {
    let alive = true
    wishesService.list().then((l) => alive && setWishes(l)).catch(() => {})
    return () => { alive = false }
  }, [])

  const submit = useCallback(async (input: { name: string; text: string }) => {
    const w = await wishesService.submit(input)
    setWishes((p) => [...p, w])
    return w
  }, [])

  return { wishes, submit }
}
