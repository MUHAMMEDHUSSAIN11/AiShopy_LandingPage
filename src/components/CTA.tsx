'use client'

import Image from 'next/image'
import FadeIn from '@/components/motion/FadeIn'

export default function CTA() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn direction="scale" duration={0.8}>
          <div className="relative overflow-hidden rounded-3xl bg-brand-green px-8 py-16 text-center text-white md:px-16 md:py-20">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <FadeIn direction="up" delay={0.1}>
                <Image
                  src="/logo.png"
                  alt="AiShopy"
                  width={140}
                  height={40}
                  className="mx-auto h-10 w-auto brightness-0 invert"
                />
              </FadeIn>
              <FadeIn direction="up" delay={0.2}>
                <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
                  Start Selling Smarter
                </h2>
              </FadeIn>
              <FadeIn direction="up" delay={0.3}>
                <p className="mx-auto mt-4 max-w-xl text-lg text-green-100">
                  Create your store, connect WhatsApp, and let AiShopy help turn conversations
                  into customers.
                </p>
              </FadeIn>
              <FadeIn direction="up" delay={0.4}>
                <a
                  href="#get-started"
                  className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-base font-semibold text-brand-green shadow-lg transition duration-300 hover:scale-105 hover:bg-green-50"
                >
                  Get the App
                </a>
              </FadeIn>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
