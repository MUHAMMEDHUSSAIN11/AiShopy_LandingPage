'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import AppStoreBadges from '@/components/AppStoreBadges'
import { APP_SCREEN_SLIDES } from '@/lib/app-screens'
import { smoothEase } from '@/lib/motion'

const AUTOPLAY_MS = 4500

export default function AppPreviewShowcase() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const count = APP_SCREEN_SLIDES.length
  const slide = APP_SCREEN_SLIDES[index]

  const go = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  const goPrev = useCallback(() => go(index - 1), [go, index])
  const goNext = useCallback(() => go(index + 1), [go, index])

  useEffect(() => {
    if (reduceMotion || paused) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [count, paused, reduceMotion])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
    }

    el.addEventListener('keydown', onKeyDown)
    return () => el.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev])

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className="outline-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="AiShopy app screenshots"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-5 shadow-xl shadow-brand-green/10 backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-green/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[280px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-gray-900/90 bg-gray-950 shadow-2xl shadow-gray-900/25 ring-1 ring-white/20">
            <div className="flex items-center justify-center px-4 pb-1.5 pt-2.5">
              <div className="h-1.5 w-16 rounded-full bg-gray-700" aria-hidden />
            </div>

            <div className="relative aspect-[9/19.2] w-full overflow-hidden bg-black">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={slide.src}
                  className="absolute inset-0"
                  initial={
                    reduceMotion ? { opacity: 1 } : { opacity: 0, x: 24 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
                  transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: smoothEase }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="280px"
                    className="object-cover object-top"
                    priority={index === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="h-3 bg-gray-950" aria-hidden />
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous screenshot"
            className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/80 text-gray-800 shadow-md backdrop-blur-md transition hover:bg-white"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next screenshot"
            className="absolute right-0 top-1/2 z-10 flex h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/80 text-gray-800 shadow-md backdrop-blur-md transition hover:bg-white"
          >
            <ChevronRight />
          </button>
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-brand-dark" aria-live="polite">
          {slide.label}
        </p>

        <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Screenshot slides">
          {APP_SCREEN_SLIDES.map((item, i) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${item.label} screenshot ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-green' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <AppStoreBadges size="md" />
        </div>
      </div>
    </div>
  )
}

function ChevronLeft() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}
