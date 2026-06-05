'use client'

import { features } from '@/lib/data'
import SectionHeading from '@/components/motion/SectionHeading'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Features"
          subtitle="Everything you need to sell through social channels, powered by AI."
        />

        <StaggerChildren className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group h-full rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand-green/30 hover:shadow-lg hover:shadow-green-50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl transition duration-300 group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
