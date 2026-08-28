import type { LegalDocumentContent } from '@/lib/legal-types'
import { COMPANY_NAME, CONTACT_EMAIL, PRIVACY_URL } from '@/lib/constants'

export const termsContent: LegalDocumentContent = {
  title: 'Terms of Use',
  subtitle: 'Using AiShopy',
  lastUpdated: 'August 28, 2026',
  summary:
    'By creating an account or using AiShopy, you agree to these Terms. Paid plans, including auto-renewable subscriptions on iOS, are described below. For privacy practices, see our Privacy Policy.',
  sections: [
    {
      title: '1. Agreement',
      paragraphs: [
        `These Terms of Use (“Terms”) govern your access to and use of the AiShopy mobile application, website, storefront tools, and related services (the “Service”) provided by ${COMPANY_NAME} (“AiShopy”, “we”, “us”, “our”).`,
        'By creating an account or using the Service, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the Service.',
      ],
    },
    {
      title: '2. Eligibility and accounts',
      paragraphs: [
        'You must provide accurate account details and keep your login credentials secure. You are responsible for activity on your store and any staff accounts you authorize.',
        'You must have the legal authority to operate your business and to connect messaging or payment services you enable in the app.',
      ],
    },
    {
      title: '3. Acceptable use',
      paragraphs: [
        'You agree not to:',
        'We may suspend or terminate accounts that violate these Terms or applicable law.',
      ],
      bullets: [
        'Misuse the Service, attempt to access other accounts, or interfere with platform security',
        'Send spam, unlawful content, or content that violates WhatsApp, Instagram, payment-provider, or other third-party rules',
        'Use AiShopy in a way that harms customers, merchants, or the platform',
      ],
    },
    {
      title: '4. Your data and customer data',
      paragraphs: [
        'You own the catalog, customer, and order data you put into AiShopy. You must have the right to collect and use that data.',
        'We process merchant and customer data only to provide the Service, as described in our Privacy Policy.',
      ],
    },
    {
      title: '5. Third-party services',
      paragraphs: [
        'WhatsApp, Instagram, Razorpay, Apple, Google, and similar providers are separate services. Their fees, availability, and policies apply in addition to these Terms.',
        'AiShopy is not responsible for outages, account decisions, or policy enforcement by those providers.',
      ],
    },
    {
      title: '6. Plans, pricing, and availability',
      paragraphs: [
        'AiShopy offers free and paid plans. Feature limits, trials, and pricing are shown in the app and may vary by region.',
        'We may change pricing or features with notice where required by law or platform rules. The Service is provided as available; we do not guarantee uninterrupted uptime.',
      ],
    },
    {
      title: '7. Auto-renewable subscriptions (Apple In-App Purchase)',
      paragraphs: [
        'On iOS, the AiShopy Business plan may be purchased as an auto-renewable subscription through Apple In-App Purchase.',
        'Subscription details:',
        'Business plan features may include unlimited orders and products, WhatsApp and Instagram inbox integration, AI-assisted replies, customer CRM tools, custom domain support, staff accounts, and priority support, as described in the app.',
        `Our Privacy Policy is available at ${PRIVACY_URL}.`,
      ],
      bullets: [
        'Subscription name: AiShopy Business',
        'Product identifier: aishopy_business_monthly',
        'Billing period: 1 month (auto-renewing)',
        'Price: shown in the app at purchase time in your local currency (for example, ₹999/month in India)',
        'Payment is charged to your Apple ID account at confirmation of purchase',
        'Subscription automatically renews unless cancelled at least 24 hours before the end of the current billing period',
        'Your Apple ID account will be charged for renewal within 24 hours prior to the end of the current period at the then-current price',
        'You can manage or cancel your subscription in iOS Settings → Apple ID → Subscriptions after purchase',
        'Any unused portion of a free trial or promotional period, if offered, is forfeited when you purchase a subscription where applicable',
        'Refunds for Apple In-App Purchase subscriptions are handled by Apple according to Apple’s policies',
      ],
    },
    {
      title: '8. Android and web payments',
      paragraphs: [
        'On Android and web, Business plan billing may be processed through supported third-party payment providers shown in the app, subject to those providers’ terms.',
        'Merchant storefront checkout payments (for your customers’ orders) are separate from AiShopy subscription billing.',
      ],
    },
    {
      title: '9. Intellectual property',
      paragraphs: [
        'AiShopy and its branding, software, and documentation remain our property. You retain rights to your store content.',
        'You grant us a limited license to host, process, and display your content as needed to operate the Service.',
      ],
    },
    {
      title: '10. Disclaimers and limitation of liability',
      paragraphs: [
        'The Service is provided “as is” and “as available”. To the fullest extent permitted by law, AiShopy disclaims warranties of merchantability, fitness for a particular purpose, and non-infringement.',
        'To the fullest extent allowed by law, AiShopy is not liable for lost profits, lost data, or indirect or consequential damages arising from your use of the app, storefront, or connected third-party services.',
      ],
    },
    {
      title: '11. Changes to these Terms',
      paragraphs: [
        'We may update these Terms from time to time. We will post the updated version on this page and change the “Last updated” date.',
        'Continued use of the Service after changes become effective means you accept the revised Terms.',
      ],
    },
    {
      title: '12. Governing law and contact',
      paragraphs: [
        'These Terms are governed by the laws of India, without regard to conflict-of-law principles, except where mandatory local consumer laws apply.',
        `Questions about these Terms: ${CONTACT_EMAIL}`,
        `${COMPANY_NAME}`,
      ],
    },
  ],
}
