'use client'

import FadeIn from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import StoreUrlHighlight from '@/components/StoreUrlHighlight'
import { catalogHighlights } from '@/lib/data'

export default function StoreShowcase() {
  return (
    <section id="store" className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn direction="left">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
                Your Online Store
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Get a professional store at{' '}
                <span className="text-gradient">your own link</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Every business gets a branded storefront on AiShopy — share one link on WhatsApp,
                Instagram, or anywhere else and let customers browse your full catalog.
              </p>

              <div className="mt-6">
                <StoreUrlHighlight storeName="fashionhub" size="lg" />
              </div>

              <StaggerChildren className="mt-8 grid gap-3 sm:grid-cols-2" stagger={0.08}>
                {catalogHighlights.map((item) => (
                  <StaggerItem key={item.label}>
                    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-brand-dark">{item.label}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-300" />
                  <span className="h-3 w-3 rounded-full bg-yellow-300" />
                  <span className="h-3 w-3 rounded-full bg-green-300" />
                </div>
                <div className="flex-1 rounded-md bg-white px-3 py-1 text-center text-xs text-gray-500">
                  <span className="font-semibold text-brand-green">fashionhub</span>
                  <span>.aishopy.com</span>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-brand-dark">Fashion Hub</p>
                    <p className="text-xs text-gray-400">Product Catalog</p>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-brand-green">
                    24 products
                  </span>
                </div>

                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                  {['All', 'Shirts', 'Dresses', 'Shoes'].map((cat, i) => (
                    <span
                      key={cat}
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        i === 0
                          ? 'bg-brand-green text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Black Cotton Shirt', price: '₹799', color: 'bg-gray-800' },
                    { name: 'Floral Summer Dress', price: '₹1,299', color: 'bg-pink-200' },
                    { name: 'White Sneakers', price: '₹2,499', color: 'bg-gray-100' },
                    { name: 'Denim Jacket', price: '₹1,899', color: 'bg-blue-200' },
                  ].map((product) => (
                    <div
                      key={product.name}
                      className="overflow-hidden rounded-xl border border-gray-100 transition hover:shadow-md"
                    >
                      <div className={`h-20 ${product.color}`} />
                      <div className="p-2.5">
                        <p className="truncate text-xs font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs font-bold text-brand-green">{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
