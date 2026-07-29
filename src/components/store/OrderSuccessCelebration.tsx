'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type OrderSuccessCelebrationProps = {
  orderId?: string
  storeName: string
}

const CONFETTI_COLORS = ['#22c55e', '#16a34a', '#facc15', '#f97316', '#3b82f6', '#ec4899', '#a855f7']

// How long to celebrate before sending the shopper back to the products page.
const REDIRECT_DELAY_MS = 5000

export default function OrderSuccessCelebration({
  orderId,
  storeName,
}: OrderSuccessCelebrationProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => router.push('/'), REDIRECT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [router])

  const confetti = useMemo(
    () =>
      Array.from({ length: 70 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.6 + Math.random() * 1.8,
        drift: (Math.random() - 0.5) * 120,
        rotate: 180 + Math.random() * 540,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        size: 7 + Math.random() * 9,
        rounded: index % 3 === 0,
      })),
    [],
  )

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Order placed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          {!reduceMotion ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              {confetti.map((piece) => (
                <motion.span
                  key={piece.id}
                  className="absolute top-0 block"
                  style={{
                    left: `${piece.left}%`,
                    width: piece.size,
                    height: piece.size,
                    backgroundColor: piece.color,
                    borderRadius: piece.rounded ? '9999px' : '2px',
                  }}
                  initial={{ y: '-12vh', opacity: 0, rotate: 0 }}
                  animate={{
                    y: '112vh',
                    x: piece.drift,
                    opacity: [0, 1, 1, 0.9, 0],
                    rotate: piece.rotate,
                  }}
                  transition={{
                    duration: piece.duration,
                    delay: piece.delay,
                    repeat: Infinity,
                    ease: 'easeIn',
                  }}
                />
              ))}
            </div>
          ) : null}

          <motion.div
            className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            initial={reduceMotion ? { opacity: 0 } : { scale: 0.7, opacity: 0, y: 30 }}
            animate={reduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0, y: 10 }}
            transition={reduceMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 260, damping: 18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-store-primary-muted text-4xl"
              initial={reduceMotion ? false : { scale: 0 }}
              animate={reduceMotion ? undefined : { scale: [0, 1.2, 1] }}
              transition={reduceMotion ? undefined : { delay: 0.15, duration: 0.5, times: [0, 0.6, 1] }}
            >
              🎉
            </motion.div>

            <h2 className="mt-5 text-2xl font-bold text-store-text">Order Placed!</h2>
            <p className="mt-2 text-sm text-gray-600">
              {orderId ? (
                <>
                  Your order <span className="font-semibold text-store-text">#{orderId}</span> has
                  been confirmed with {storeName}.
                </>
              ) : (
                <>Your order has been confirmed with {storeName}.</>
              )}{' '}
              They&apos;ll reach out to you shortly. 🛍️
            </p>

            <div className="mt-7 flex flex-col gap-2">
              <Link
                href="/"
                className="w-full rounded-full bg-store-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-store-primary-hover"
              >
                Continue Shopping
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-full px-6 py-2.5 text-sm font-medium text-gray-500 transition hover:text-store-text"
              >
                View order details
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400">Taking you back to the store…</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
