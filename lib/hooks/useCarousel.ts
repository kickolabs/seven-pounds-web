import { useState, useEffect, useCallback } from "react"

export function useCarousel(length: number, interval = 4000) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback(
    (idx: number) => {
      setDirection(idx > active ? 1 : -1)
      setActive(idx)
    },
    [active]
  )

  const prev = () => go((active - 1 + length) % length)
  const next = useCallback(() => go((active + 1) % length), [active, go, length])

  useEffect(() => {
    const id = setTimeout(next, interval)
    return () => clearTimeout(id)
  }, [next, interval])

  return { active, direction, go, prev, next }
}
