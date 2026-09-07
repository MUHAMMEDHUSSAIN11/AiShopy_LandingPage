import type { Metadata } from 'next'
import { findVariantById, getProductImages } from '@/lib/product-utils'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

/** Absolute AiShopy app icon — used for marketing site and fallbacks. */
export const AISHOPY_APP_ICON_URL = 'https://www.aishopy.io/app-icon.png'

export const AISHOPY_SITE_ORIGIN = 'https://www.aishopy.io'

const STOREFRONT_HOST = 'aishopy.io'

export function storefrontOrigin(storeSlug: string): string {
  return `https://${storeSlug}.${STOREFRONT_HOST}`
}

/**
 * Resolve a usable absolute image URL for crawlers (Instagram/WhatsApp/etc.).
 * Relative paths are resolved against the main AiShopy origin (for /app-icon.png).
 */
export function toAbsoluteImageUrl(url: string | null | undefined): string {
  const trimmed = url?.trim()
  if (!trimmed) return AISHOPY_APP_ICON_URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('/')) return `${AISHOPY_SITE_ORIGIN}${trimmed}`
  return AISHOPY_APP_ICON_URL
}

function ogImage(url: string, alt: string): NonNullable<Metadata['openGraph']>['images'] {
  return [
    {
      url,
      width: 1200,
      height: 630,
      alt,
    },
  ]
}

/** Marketing site (aishopy.io / www) — always app logo. */
export function buildMarketingMetadata(): Metadata {
  const title = 'AiShopy — Turn WhatsApp & Instagram Chats Into Sales'
  const description =
    'AiShopy helps businesses sell products through WhatsApp and Instagram with an AI-powered sales assistant, online storefront, and order tracking.'
  const image = AISHOPY_APP_ICON_URL

  return {
    title,
    description,
    alternates: {
      canonical: AISHOPY_SITE_ORIGIN,
    },
    openGraph: {
      type: 'website',
      url: AISHOPY_SITE_ORIGIN,
      siteName: 'AiShopy',
      title,
      description,
      images: ogImage(image, 'AiShopy'),
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [image],
    },
  }
}

/** Store home (slug.aishopy.io) — store logo, else app logo. */
export function buildStoreMetadata(store: Store): Metadata {
  const origin = storefrontOrigin(store.slug)
  const title = store.name
  const description =
    store.description?.trim() ||
    `Shop ${store.name} on AiShopy — browse products and order online.`
  const image = toAbsoluteImageUrl(store.logoUrl || undefined)
  const imageAlt = store.logoUrl ? `${store.name} logo` : 'AiShopy'

  return {
    title,
    description,
    alternates: {
      canonical: origin,
    },
    openGraph: {
      type: 'website',
      url: origin,
      siteName: store.name,
      title,
      description,
      images: ogImage(image, imageAlt),
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [image],
    },
  }
}

/**
 * Product (and optional variant) page —
 * variant image → product image → store logo → app logo.
 */
export function buildProductMetadata(input: {
  store: Store
  product: Product
  variantId?: string | null
}): Metadata {
  const { store, product } = input
  const variantId = input.variantId?.trim() || undefined
  const variant = variantId ? findVariantById(product, variantId) : undefined
  const images = getProductImages(product, variant)
  const image = toAbsoluteImageUrl(
    images[0] || store.logoUrl || undefined,
  )

  const origin = storefrontOrigin(store.slug)
  const path = `/product/${encodeURIComponent(product.slug)}`
  const url = variantId
    ? `${origin}${path}?variant=${encodeURIComponent(variantId)}`
    : `${origin}${path}`

  const title = variant?.name
    ? `${product.name} — ${variant.name}`
    : product.name
  const description =
    product.description?.trim() ||
    `${product.name} from ${store.name}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      siteName: store.name,
      title,
      description,
      images: ogImage(image, title),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
