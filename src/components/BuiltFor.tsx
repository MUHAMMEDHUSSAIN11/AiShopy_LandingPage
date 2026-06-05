'use client'

import { audiences } from '@/lib/data'
import SectionHeading from '@/components/motion/SectionHeading'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'

export default function BuiltFor() {
  return (
    <section id="built-for" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Built For"
          subtitle="Whether you run a boutique or a gadget store, AiShopy fits your business."
        />

        <StaggerChildren className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {audiences.map((item) => (
            <StaggerItem key={item.title}>
              <div className="rounded-2xl border border-gray-200 p-6 text-center transition duration-300 hover:-translate-y-1.5 hover:border-brand-green/30 hover:shadow-md">
                <div className="text-4xl transition duration-300 hover:scale-110">{item.icon}</div>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
