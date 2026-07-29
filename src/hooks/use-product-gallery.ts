'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const SWIPE_THRESHOLD_PX = 48

export function useProductGallery(images: string[]) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const imageCount = images.length

  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  const goToPrevious = useCallback(() => {
    if (imageCount <= 1) return
    setActiveIndex((index) => (index === 0 ? imageCount - 1 : index - 1))
  }, [imageCount])

  const goToNext = useCallback(() => {
    if (imageCount <= 1) return
    setActiveIndex((index) => (index === imageCount - 1 ? 0 : index + 1))
  }, [imageCount])

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }, [])

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (touchStartX.current === null || imageCount <= 1) return

      const endX = event.changedTouches[0]?.clientX
      if (endX === undefined) {
        touchStartX.current = null
        return
      }

      const delta = endX - touchStartX.current
      if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
        if (delta < 0) goToNext()
        else goToPrevious()
      }

      touchStartX.current = null
    },
    [goToNext, goToPrevious, imageCount],
  )

  return {
    activeIndex,
    setActiveIndex,
    goToPrevious,
    goToNext,
    onTouchStart,
    onTouchEnd,
    hasMultiple: imageCount > 1,
  }
}
