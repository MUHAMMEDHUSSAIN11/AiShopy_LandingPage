'use client'

import { customerQuestions } from '@/lib/data'
import FadeIn from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'

export default function SocialCommerce() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn direction="left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Social Commerce Made Simple
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Most businesses receive customer inquiries on WhatsApp and Instagram every day.
              </p>
              <p className="mt-4 font-medium text-gray-800">Customers ask:</p>
              <ul className="mt-4 space-y-3">
                <StaggerChildren stagger={0.08}>
                  {customerQuestions.map((q) => (
                    <StaggerItem key={q}>
                      <li className="flex items-center gap-3 text-gray-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-brand-green">
                          ?
                        </span>
                        {q}
                      </li>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8">
              <p className="text-lg leading-relaxed text-gray-700">
                AiShopy automatically responds to customer questions, shares product details,
                sends checkout links, and helps convert conversations into orders.
              </p>
              <StaggerChildren className="mt-8 grid grid-cols-2 gap-4" stagger={0.1}>
                {[
                  { icon: '🤖', label: 'Auto-replies' },
                  { icon: '🛍️', label: 'Product details' },
                  { icon: '🔗', label: 'Checkout links' },
                  { icon: '📦', label: 'Order conversion' },
                ].map((item) => (
                  <StaggerItem key={item.label}>
                    <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                      <div className="text-2xl">{item.icon}</div>
                      <p className="mt-2 text-sm font-medium text-gray-700">{item.label}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
