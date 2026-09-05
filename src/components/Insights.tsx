'use client'

import { insights } from '@/lib/data'
import FadeIn from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'

export default function Insights() {
  return (
    <section className="bg-brand-dark py-20 text-white md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-stretch gap-12 lg:grid-cols-2 lg:items-center">
          <FadeIn direction="left">
            <div className="mx-auto w-full max-w-lg text-center lg:mx-0 lg:max-w-none lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                AI-Powered Insights
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                AiShopy helps you understand your business. See what&apos;s working and where to
                grow.
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="mx-auto grid w-full max-w-lg gap-3 sm:grid-cols-2 lg:mx-0 lg:max-w-none" stagger={0.07}>
            {insights.map((item) => (
              <StaggerItem key={item}>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-left backdrop-blur-sm transition duration-300 hover:border-brand-green/30 hover:bg-white/10">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/20 text-brand-green">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-gray-200">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  )
}
