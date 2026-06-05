'use client'

import { motion, useReducedMotion } from 'framer-motion'
import WaitlistForm from '@/components/WaitlistForm'
import FadeIn from '@/components/motion/FadeIn'
import StoreUrlHighlight from '@/components/StoreUrlHighlight'
import { smoothEase } from '@/lib/motion'

export default function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-50/80 to-white" />
      <motion.div
        className="absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 left-0 -z-10 h-72 w-72 rounded-full bg-emerald-100 blur-3xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <FadeIn direction="down" view={false} delay={0.1}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-brand-green">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-green" />
                AI-Powered Social Commerce
              </div>
            </FadeIn>

            <FadeIn direction="up" view={false} delay={0.2}>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Turn WhatsApp &amp; Instagram{' '}
                <span className="text-gradient">Chats Into Sales</span>
              </h1>
            </FadeIn>

            <FadeIn direction="up" view={false} delay={0.35}>
              <p className="mt-6 text-lg text-gray-600 md:text-xl">
                AiShopy helps businesses sell products through WhatsApp and Instagram with an
                AI-powered sales assistant, online storefront, inventory management, and order
                tracking — all in one place.
              </p>
            </FadeIn>

            <FadeIn direction="up" view={false} delay={0.45}>
              <p className="mt-4 font-medium text-gray-800">
                Create your store. Connect WhatsApp. Start selling.
              </p>
              <div className="mt-5 flex justify-center lg:justify-start">
                <StoreUrlHighlight size="lg" />
              </div>
            </FadeIn>

            <FadeIn direction="up" view={false} delay={0.6} className="mt-10 hidden lg:block">
              <motion.div
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-100"
                animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-start gap-4 text-left">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg">
                    💬
                  </div>
                  <div className="flex-1 space-y-3">
                    <motion.div
                      className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-sm text-gray-700"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9, duration: 0.5, ease: smoothEase }}
                    >
                      Do you have black shirts under ₹1000?
                    </motion.div>
                    <motion.div
                      className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-green px-4 py-3 text-sm text-white"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3, duration: 0.5, ease: smoothEase }}
                    >
                      Yes! Here are 3 options from your catalog — tap to view &amp; buy →
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          </div>

          <FadeIn direction="right" view={false} delay={0.5} className="lg:pl-4">
            <div id="get-started">
              <WaitlistForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
