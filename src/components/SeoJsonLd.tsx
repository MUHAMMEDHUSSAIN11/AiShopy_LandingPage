import { COMPANY_NAME, CONTACT_EMAIL, PLAY_STORE_URL } from '@/lib/constants'
import { faqs, steps } from '@/lib/data'
import { AISHOPY_APP_ICON_URL, AISHOPY_SITE_ORIGIN } from '@/lib/og-metadata'
import { pricingPlans } from '@/lib/pricing'

const ORGANIZATION_ID = `${AISHOPY_SITE_ORIGIN}/#organization`
const SOFTWARE_ID = `${AISHOPY_SITE_ORIGIN}/#software`
const PRICING_URL = `${AISHOPY_SITE_ORIGIN}/#pricing`

const NUMERIC_OFFERS: Record<string, string> = {
  starter: '0',
  business: '999',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'AiShopy',
      url: AISHOPY_SITE_ORIGIN,
      logo: AISHOPY_APP_ICON_URL,
      email: CONTACT_EMAIL,
      legalName: COMPANY_NAME,
    },
    {
      '@type': 'SoftwareApplication',
      '@id': SOFTWARE_ID,
      name: 'AiShopy',
      url: AISHOPY_SITE_ORIGIN,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Android, iOS, Web',
      downloadUrl: PLAY_STORE_URL,
      publisher: { '@id': ORGANIZATION_ID },
      offers: pricingPlans
        .filter((plan) => plan.id in NUMERIC_OFFERS)
        .map((plan) => ({
          '@type': 'Offer' as const,
          name: plan.name,
          price: NUMERIC_OFFERS[plan.id],
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: PRICING_URL,
        })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${AISHOPY_SITE_ORIGIN}/#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question' as const,
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: faq.answer,
        },
      })),
    },
    {
      '@type': 'HowTo',
      '@id': `${AISHOPY_SITE_ORIGIN}/#howto`,
      name: 'How to sell on WhatsApp and Instagram with AiShopy',
      description:
        'Five simple steps to turn your social chats into a thriving sales channel.',
      step: steps.map((step, index) => ({
        '@type': 'HowToStep' as const,
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
    },
  ],
}

/** Invisible Organization, SoftwareApplication, FAQPage, and HowTo structured data for marketing home. */
export default function SeoJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
