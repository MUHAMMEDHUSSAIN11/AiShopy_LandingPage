'use client'

import { reasons } from '@/lib/data'
import SectionHeading from '@/components/motion/SectionHeading'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'

export default function WhyChoose() {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title="Why Businesses Choose AiShopy" />

        <StaggerChildren className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {reasons.map((reason, i) => (
            <StaggerItem key={reason.title}>
              <div className="h-full rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold">{reason.title}</h3>
                <p className="mt-2 text-gray-600">{reason.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
