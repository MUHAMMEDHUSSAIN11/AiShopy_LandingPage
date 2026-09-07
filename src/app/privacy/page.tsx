import type { Metadata } from 'next'
import LegalDocument from '@/components/legal/LegalDocument'
import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { privacyContent } from '@/lib/privacy-content'

export const metadata: Metadata = {
  title: 'Privacy Policy — AiShopy',
  description:
    'How AiShopy collects, uses, and protects merchant, customer, and WhatsApp data.',
  alternates: {
    canonical: 'https://www.aishopy.io/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <LegalPageLayout>
      <LegalDocument content={privacyContent} />
    </LegalPageLayout>
  )
}
