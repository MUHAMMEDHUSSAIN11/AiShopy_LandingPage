'use client'

import { steps } from '@/lib/data'
import SectionHeading from '@/components/motion/SectionHeading'
import FadeIn from '@/components/motion/FadeIn'
import StoreUrlHighlight from '@/components/StoreUrlHighlight'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="How AiShopy Works"
          subtitle="Five simple steps to turn your social chats into a thriving sales channel."
        />

        <div className="mt-16 space-y-8">
          {steps.map((step, i) => (
            <FadeIn key={step.number} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.05}>
              <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:p-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex items-center gap-4 md:w-48 md:shrink-0 md:flex-col md:items-start">
                    <span className="text-4xl">{step.icon}</span>
                    <span className="text-sm font-bold text-brand-green">{step.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold md:text-2xl">{step.title}</h3>
                    <p className="mt-3 text-gray-600">{step.description}</p>

                    {'example' in step && step.example && (
                      <div className="mt-4">
                        <StoreUrlHighlight size="md" />
                        <p className="mt-2 text-sm text-gray-500">
                          Your catalog lives on your own branded subdomain.
                        </p>
                      </div>
                    )}

                    {'examples' in step && step.examples && (
                      <div className="mt-4 space-y-2">
                        {step.examples.map((ex) => (
                          <div
                            key={ex}
                            className="rounded-xl bg-gray-50 px-4 py-3 text-sm italic text-gray-700"
                          >
                            {ex}
                          </div>
                        ))}
                      </div>
                    )}

                    {'items' in step && step.items && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {step.items.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-brand-green"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {'statuses' in step && step.statuses && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {step.statuses.map((status, j) => (
                          <span
                            key={status}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              j === step.statuses.length - 1
                                ? 'bg-brand-green text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {status}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div className="absolute -bottom-4 left-1/2 hidden h-8 w-px -translate-x-1/2 bg-brand-green/30 md:block" />
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
