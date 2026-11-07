export function buildStorefrontProductShareUrl(input: {
  publicUrl?: string | null
  productSlug: string
  variantId?: string | number | null
}): string {
  const origin = input.publicUrl?.trim().replace(/\/$/, '') ?? ''
  const path = `/product/${input.productSlug}`
  const base = origin ? `${origin}${path}` : path
  if (input.variantId == null || input.variantId === '') return base
  return `${base}?variant=${encodeURIComponent(String(input.variantId))}`
}
