import SectionHeading from '@/components/motion/SectionHeading'
import { faqs } from '@/lib/data'

export default function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Frequently asked questions"
          subtitle="Short answers about AiShopy, WhatsApp and Instagram selling, pricing, and your storefront."
        />

        <div className="mx-auto mt-14 max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              name="faq"
              open={index === 0}
              className="group rounded-2xl border border-gray-200 bg-white shadow-sm open:border-brand-green/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 sm:p-8 [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg font-bold text-brand-dark md:text-xl">{faq.question}</h3>
                <svg
                  className="h-5 w-5 shrink-0 text-brand-green transition-transform duration-200 group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 7.5 10 12.5 15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <p className="px-6 pb-6 text-gray-600 sm:px-8 sm:pb-8">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
