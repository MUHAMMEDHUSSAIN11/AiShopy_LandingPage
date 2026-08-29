'use client'

import FadeIn from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { pricingPlans } from '@/lib/pricing'

export default function Pricing() {
  return (
    <section id="pricing" className="overflow-hidden bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn direction="up">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
              Pricing
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Simple plans that grow with your business
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start free, upgrade when you need AI inbox, unlimited catalog, and team access.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-6 lg:grid-cols-3" stagger={0.12}>
          {pricingPlans.map((plan) => (
            <StaggerItem key={plan.id}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm md:p-8 ${
                  plan.highlighted
                    ? 'border-brand-green shadow-lg shadow-green-100 ring-2 ring-brand-green/20'
                    : 'border-gray-200'
                }`}
              >
                {plan.highlighted ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                ) : null}

                <div>
                  <h3 className="text-xl font-bold text-brand-dark">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight text-brand-dark">
                      {plan.price}
                    </span>
                    {plan.priceNote ? (
                      <span className="text-sm text-gray-500">{plan.priceNote}</span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{plan.description}</p>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 text-brand-green">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.ctaHref}
                  className={`mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                    plan.highlighted
                      ? 'bg-brand-green text-white hover:bg-emerald-600'
                      : 'border border-gray-200 bg-white text-brand-dark hover:border-brand-green hover:text-brand-green'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
