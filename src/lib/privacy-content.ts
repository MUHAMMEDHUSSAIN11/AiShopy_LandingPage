import type { LegalDocumentContent } from '@/lib/legal-types'
import { CONTACT_EMAIL, COMPANY_NAME } from '@/lib/constants'

export const privacyContent: LegalDocumentContent = {
  title: 'Privacy Policy',
  subtitle: 'How AiShopy handles your information',
  lastUpdated: 'September 1, 2026',
  summary:
    'AiShopy helps merchants run a store and WhatsApp inbox. We collect account, store, product, order, and WhatsApp message data to provide the app. We use providers like Meta (WhatsApp), Supabase, and cloud hosting. Chat Boat uses third-party AI (OpenAI and/or TokenBee) only with your consent. We do not sell your data. You can delete your account in the app or contact aishopyapp@gmail.com.',
  sections: [
    {
      title: '1. Introduction',
      paragraphs: [
        'AiShopy (“we”, “us”, “our”) provides a mobile and web-based platform that helps merchants manage their online store, product catalog, orders, and WhatsApp Business messaging in one place.',
        'This Privacy Policy explains how we collect, use, store, share, and protect information when you use the AiShopy application, website, and related services (collectively, the “Service”).',
        'By using the Service, you agree to this Privacy Policy. If you do not agree, please do not use the Service.',
        `Contact: ${CONTACT_EMAIL}`,
        `Business name: ${COMPANY_NAME}`,
      ],
    },
    {
      title: '2. Who this policy applies to',
      paragraphs: ['This policy applies to:'],
      bullets: [
        'Merchants — business users who create a store and use AiShopy to manage products, orders, and WhatsApp conversations.',
        'End customers — people who message a merchant on WhatsApp or place orders through a merchant’s storefront linked to AiShopy. Merchants are responsible for their own customer relationships; we process customer data on the merchant’s behalf to provide the Service.',
      ],
    },
    {
      title: '3. Information we collect',
      subsections: [
        {
          title: '3.1 Account and profile information',
          paragraphs: ['When you register or sign in, we may collect:'],
          bullets: [
            'Email address',
            'Authentication identifiers (e.g. from our authentication provider)',
            'Name or display name (if you provide it)',
          ],
        },
        {
          title: '3.2 Store and business information',
          paragraphs: ['When you create or manage a store, we may collect:'],
          bullets: [
            'Store name, description, slug, and branding (e.g. logo)',
            'Currency, timezone, and business settings',
            'WhatsApp phone number associated with your store',
          ],
        },
        {
          title: '3.3 WhatsApp and messaging data',
          paragraphs: [
            'If you connect WhatsApp Business through our Service (including via Meta’s Embedded Signup or related flows), we may collect and store:',
            'Messages and contacts are stored so merchants can use the inbox, order flows, and related features in the app.',
          ],
          bullets: [
            'WhatsApp Business Account (WABA) identifiers and phone number IDs',
            'Access tokens and connection metadata needed to operate the integration (stored securely and used only to provide the Service)',
            'Conversation metadata (e.g. customer phone numbers, timestamps, read/unread state)',
            'Message content and related metadata (e.g. text, message type, delivery status) sent or received through the connected WhatsApp number',
            'Contact information synced from WhatsApp where you enable such features (e.g. customer names and phone numbers)',
            'Historical message data if you opt in during WhatsApp onboarding, as permitted by Meta',
          ],
        },
        {
          title: '3.4 Customer and order data',
          paragraphs: ['We may process data about your customers, including:'],
          bullets: [
            'WhatsApp number, name, email (if provided)',
            'Order details, shipping address, payment method selection, and order status',
            'Notes, tags, or other fields you enter in the dashboard',
          ],
        },
        {
          title: '3.5 Product and catalog data',
          bullets: [
            'Product names, descriptions, prices, images, categories, inventory, and variants',
          ],
        },
        {
          title: '3.6 Technical and usage data',
          paragraphs: [
            'We may automatically collect:',
            'We do not use this data to sell your personal information.',
          ],
          bullets: [
            'Device type, operating system, and app version',
            'IP address and general log data (e.g. API requests, errors, timestamps)',
            'Information needed to maintain security, prevent abuse, and improve reliability',
          ],
        },
        {
          title: '3.7 Chat Boat (third-party AI)',
          paragraphs: [
            'If you enable Chat Boat auto-reply, we may send the following to third-party AI providers (such as OpenAI and/or TokenBee) to generate replies:',
            'We ask for your explicit consent in the app before enabling Chat Boat. You can disable Chat Boat or switch any conversation to manual reply at any time.',
          ],
          bullets: [
            'Customer messages and conversation history from connected WhatsApp or Instagram inboxes',
            'Your product catalog, store name, and storefront links',
            'Custom instructions you add in Chat Boat settings',
          ],
        },
      ],
    },
    {
      title: '4. How we use information',
      paragraphs: [
        'We use collected information to:',
        'We process merchant data as necessary to perform our contract with you (providing the Service). Where required, we rely on your instructions as the merchant for customer data you control.',
      ],
      bullets: [
        'Create and manage your account and store',
        'Provide the inbox, messaging, catalog, and order features',
        'Connect and maintain WhatsApp Business integration via Meta’s APIs',
        'Send, receive, store, and display messages and sync data as configured by you',
        'Process orders and display them in your dashboard',
        'Authenticate users and enforce access controls (e.g. store ownership)',
        'Operate, secure, debug, and improve the Service',
        'Comply with legal obligations and respond to lawful requests',
      ],
    },
    {
      title: '5. Legal basis (where applicable)',
      paragraphs: ['If you are in a region that requires a legal basis (e.g. UK/EEA), we rely on:'],
      bullets: [
        'Contract — to provide the Service you signed up for',
        'Legitimate interests — security, fraud prevention, and product improvement',
        'Consent — where required for optional features or marketing (if any)',
        'Legal obligation — when the law requires us to retain or disclose data',
      ],
    },
    {
      title: '6. How we share information',
      paragraphs: ['We do not sell your personal information.', 'We may share information with:'],
      subsections: [
        {
          title: '6.1 Service providers (processors)',
          paragraphs: [
            'Trusted third parties that help us run the Service, such as:',
            'These providers process data only to perform services for us and under appropriate agreements.',
          ],
          bullets: [
            'Meta / WhatsApp — to connect your WhatsApp Business account, send/receive messages, and sync data allowed by Meta’s products and your permissions',
            'Cloud hosting (e.g. Railway) — to run our application servers',
            'Database and authentication (e.g. Supabase) — to store data and manage sign-in',
            'Storage — for product images and uploaded files',
            'Third-party AI (e.g. OpenAI, TokenBee) — when you enable Chat Boat, to generate automated customer replies from your inbox and catalog data',
          ],
        },
        {
          title: '6.2 Merchants and end customers',
          bullets: [
            'Messages you send as a merchant are delivered to your customers via WhatsApp.',
            'Data you enter about customers is visible to you in your store dashboard.',
          ],
        },
        {
          title: '6.3 Legal and safety',
          paragraphs: ['We may disclose information if we believe it is necessary to:'],
          bullets: [
            'Comply with law, regulation, legal process, or government request',
            'Protect the rights, safety, and security of AiShopy, our users, or others',
            'Enforce our terms or investigate misuse',
          ],
        },
        {
          title: '6.4 Business transfers',
          paragraphs: [
            'If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to this policy.',
          ],
        },
      ],
    },
    {
      title: '7. Data retention',
      paragraphs: [
        'We retain information for as long as your account is active or as needed to provide the Service, unless a longer period is required by law.',
        'You may request deletion of your account and associated data (see Section 10). Some data may remain in backups for a limited period before being overwritten.',
        'WhatsApp-related data is retained according to your use of the Service and your disconnect actions; when you disconnect WhatsApp, we stop using tokens for new operations and handle stored data according to our deletion process.',
      ],
    },
    {
      title: '8. Security',
      paragraphs: [
        'We use reasonable technical and organizational measures to protect information, including:',
        'No method of transmission or storage is 100% secure. You are responsible for keeping your login credentials safe.',
      ],
      bullets: [
        'Encrypted connections (HTTPS/TLS) for data in transit',
        'Access controls so merchants can only access their own store data',
        'Secure storage of credentials and tokens with restricted server access',
      ],
    },
    {
      title: '9. International transfers',
      paragraphs: [
        'Your information may be processed in countries other than your own, including where our service providers operate. We take steps designed to ensure appropriate safeguards where required by applicable law.',
      ],
    },
    {
      title: '10. Your rights and choices',
      paragraphs: [
        'Depending on your location, you may have the right to:',
        `Merchants: To exercise these rights, contact us at ${CONTACT_EMAIL}. We will respond within a reasonable time and as required by law.`,
        'Delete your account in the app: open Settings → Admin Dashboard → Delete account to permanently remove your account and any stores you own. This is immediate and does not require contacting support.',
        'Disconnect WhatsApp: You can disconnect WhatsApp from the Business app or our connection flow where available; contact us if you need help removing stored connection data.',
        'End customers: Please contact the merchant you interacted with first; they control the business relationship. We can assist merchants with data requests related to data we process on their behalf.',
      ],
      bullets: [
        'Access — request a copy of personal data we hold about you',
        'Correction — ask us to correct inaccurate data',
        'Deletion — request deletion of your account and associated data',
        'Restriction or objection — in certain cases, limit or object to processing',
        'Portability — receive data in a structured format where applicable',
        'Withdraw consent — where processing is based on consent',
      ],
    },
    {
      title: '11. Children',
      paragraphs: [
        'The Service is intended for businesses and is not directed at children under 13 (or the minimum age in your country). We do not knowingly collect personal information from children. If you believe we have done so, contact us and we will delete it.',
      ],
    },
    {
      title: '12. Third-party services and links',
      paragraphs: [
        'The Service integrates with Meta WhatsApp Business Platform. Your use of WhatsApp is also subject to Meta’s and WhatsApp’s terms and policies:',
        'We are not responsible for third-party websites or services linked from our Service.',
      ],
      bullets: [
        'Meta Terms of Service: https://www.facebook.com/terms.php',
        'WhatsApp Business Terms: https://www.whatsapp.com/legal/business-terms',
        'WhatsApp Business Messaging Policy: https://www.whatsapp.com/legal/business-policy',
      ],
    },
    {
      title: '13. Changes to this policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. We will post the updated version on this page and change the “Last updated” date. Continued use of the Service after changes means you accept the updated policy. For material changes, we may provide additional notice in the app or by email where appropriate.',
      ],
    },
    {
      title: '14. Contact us',
      paragraphs: [
        'For privacy questions, data requests, or complaints:',
        `Email: ${CONTACT_EMAIL}`,
        'App name: AiShopy',
        'We will work to resolve your concern. You may also have the right to lodge a complaint with your local data protection authority.',
      ],
    },
  ],
}
