'use client'

import FadeIn from '@/components/motion/FadeIn'
import AppStoreBadges from '@/components/AppStoreBadges'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { mobileAppFeatures } from '@/lib/data'

export default function MobileApp() {
  return (
    <section id="mobile-app" className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn direction="left">
            <div className="relative mx-auto w-64 max-w-full lg:mx-0">
              <div className="rounded-[2.5rem] border-4 border-gray-800 bg-gray-800 p-2 shadow-2xl">
                <div className="overflow-hidden rounded-[2rem] bg-white">
                  <div className="bg-brand-green px-4 py-5 text-white">
                    <p className="text-xs opacity-80">AiShopy Owner</p>
                    <p className="text-lg font-bold">Dashboard</p>
                  </div>
                  <div className="space-y-3 p-4">
                    {[
                      { label: 'Today\'s Orders', value: '12', color: 'bg-green-50 text-brand-green' },
                      { label: 'Pending Replies', value: '3', color: 'bg-orange-50 text-orange-600' },
                      { label: 'Low Stock Items', value: '2', color: 'bg-red-50 text-red-500' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${stat.color}`}
                      >
                        <span className="text-xs font-medium">{stat.label}</span>
                        <span className="text-sm font-bold">{stat.value}</span>
                      </div>
                    ))}
                    <div className="rounded-xl border border-gray-100 p-3">
                      <p className="text-xs font-semibold text-gray-700">Quick Actions</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-lg">
                        <span>📦</span>
                        <span>💬</span>
                        <span>📋</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute right-2 top-2 rounded-full bg-brand-green px-3 py-1 text-xs font-bold text-white shadow-lg">
                Mobile App
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
                Manage On The Go
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Mobile app built for store owners
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Run your entire business from your phone. The AiShopy owner app makes it easy to
                manage orders, update your catalog, reply to customers, and track sales — without
                needing a laptop.
              </p>

              <StaggerChildren className="mt-8 space-y-4" stagger={0.1}>
                {mobileAppFeatures.map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-brand-green">
                        ✓
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>

              <AppStoreBadges className="mt-8" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
