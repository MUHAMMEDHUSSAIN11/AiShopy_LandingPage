'use client'

import FadeIn from '@/components/motion/FadeIn'
import SectionHeading from '@/components/motion/SectionHeading'
import { CONTACT_EMAIL } from '@/lib/constants'

export default function ContactUs() {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Contact Us"
          subtitle="Have questions about AiShopy? We'd love to hear from you."
        />

        <FadeIn direction="scale" delay={0.15}>
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-lg shadow-gray-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
              ✉️
            </div>
            <h3 className="mt-5 text-xl font-bold text-brand-dark">Get in touch</h3>
            <p className="mt-2 text-gray-600">
              Reach out for demos, partnerships, or support — we typically respond within 24 hours.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 inline-block rounded-full bg-brand-green px-8 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-600"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-4 text-sm text-gray-400">
              Or copy:{' '}
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(CONTACT_EMAIL)}
                className="font-medium text-brand-green underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </button>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
