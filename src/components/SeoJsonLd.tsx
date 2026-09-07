import { COMPANY_NAME, CONTACT_EMAIL } from '@/lib/constants'
import { AISHOPY_APP_ICON_URL, AISHOPY_SITE_ORIGIN } from '@/lib/og-metadata'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'AiShopy',
      url: AISHOPY_SITE_ORIGIN,
      logo: AISHOPY_APP_ICON_URL,
      email: CONTACT_EMAIL,
      legalName: COMPANY_NAME,
    },
    {
      '@type': 'SoftwareApplication',
      name: 'AiShopy',
      url: AISHOPY_SITE_ORIGIN,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Android, iOS, Web',
      publisher: {
        '@type': 'Organization',
        name: COMPANY_NAME,
        email: CONTACT_EMAIL,
      },
    },
  ],
}

/** Invisible Organization + SoftwareApplication structured data for marketing home. */
export default function SeoJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
