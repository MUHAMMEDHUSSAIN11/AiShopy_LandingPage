export type PricingPlanId = 'starter' | 'business' | 'enterprise'

export type PricingPlan = {
  id: PricingPlanId
  name: string
  price: string
  priceNote?: string
  description: string
  features: readonly string[]
  cta: string
  ctaHref: string
  highlighted?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    priceNote: 'forever',
    description: 'Launch your store and start taking orders at no cost.',
    features: [
      '50 orders / month',
      '20 products',
      'Basic store link',
      '1 user',
      'Accept local payments',
      'Order management',
    ],
    cta: 'Get the App',
    ctaHref: '#get-started',
  },
  {
    id: 'business',
    name: 'Business',
    price: '₹999',
    priceNote: '₹99 / 1st month trial',
    description: 'Everything you need to scale sales on WhatsApp and Instagram.',
    features: [
      'Unlimited orders',
      'Unlimited products',
      'WhatsApp inbox integration',
      'Instagram inbox integration',
      'AI auto replies',
      'AI product recommendations',
      'Customer CRM & tags',
      'Custom domain',
      '4 staff accounts',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    ctaHref: '#get-started',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    priceNote: 'tailored for your team',
    description: 'For larger teams that need hands-on support and custom setup.',
    features: ['Custom integrations','Custom plans & pricing'],
    cta: 'Contact Us',
    ctaHref: '#contact',
  },
]
