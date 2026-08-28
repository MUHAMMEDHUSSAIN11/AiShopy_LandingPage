import type { Metadata } from 'next'
import LegalDocument from '@/components/legal/LegalDocument'
import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { termsContent } from '@/lib/terms-content'

export const metadata: Metadata = {
  title: 'Terms of Use — AiShopy',
  description:
    'Terms of use for AiShopy, including auto-renewable Business subscriptions on iOS.',
}

export default function TermsPage() {
  return (
    <LegalPageLayout>
      <LegalDocument content={termsContent} />
    </LegalPageLayout>
  )
}
