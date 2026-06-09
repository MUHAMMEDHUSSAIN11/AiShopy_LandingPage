'use client'

import { platformItems } from '@/lib/data'
import FadeIn from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'

export default function Platform() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn direction="scale">
          <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-10 md:p-16">
            <FadeIn direction="up">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Everything You Need To Sell Through WhatsApp &amp; Instagram
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                  AiShopy combines all the tools your business needs — all in one platform.
                </p>
              </div>
            </FadeIn>

            <StaggerChildren
              className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3"
              stagger={0.06}
            >
              {platformItems.map((item) => (
                <StaggerItem key={item}>
                  {item === 'yourstore.aishopy.io' ? (
                    <span className="inline-flex items-center rounded-full border-2 border-brand-green/30 bg-green-50 px-5 py-2.5 font-mono text-sm font-semibold shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                      <span className="text-brand-green">yourstore</span>
                      <span className="text-gray-500">.aishopy.io</span>
                    </span>
                  ) : (
                    <span className="inline-block rounded-full border border-green-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md">
                      {item}
                    </span>
                  )}
                </StaggerItem>
              ))}
            </StaggerChildren>

            <FadeIn direction="up" delay={0.3}>
              <p className="mt-8 text-center text-lg font-semibold text-brand-green">
                All in one platform.
              </p>
            </FadeIn>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
