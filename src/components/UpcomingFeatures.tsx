'use client'

import SectionHeading from '@/components/motion/SectionHeading'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { upcomingFeatures } from '@/lib/data'

export default function UpcomingFeatures() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Coming Soon"
          subtitle="We're building more tools to help you sell and deliver faster."
        />

        <StaggerChildren
          className="mx-auto mt-14 grid max-w-2xl gap-6 sm:grid-cols-1"
          stagger={0.12}
        >
          {upcomingFeatures.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="relative rounded-2xl border border-dashed border-brand-green/40 bg-white p-8">
                <span className="absolute -top-3 right-6 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                  Upcoming
                </span>
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
