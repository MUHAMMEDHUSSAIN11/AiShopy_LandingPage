import 'server-only'
import { z } from 'zod'
import { AISHOPY_API_URL } from '@/lib/env'
import { slugify } from '@/lib/slugify'
import { isVariantPurchasable } from '@/lib/product-utils'
import type { Catalog, CatalogQueryParams } from '@/types/catalog'
import { flattenCategories } from '@/types/category'
import type { Category } from '@/types/category'
import type { Product, ProductVariant } from '@/types/product'
import type { CartOrderItem, OrderCreateResponse, ShippingAddress } from '@/types/customer'
import type { Store, StorePaymentMethods, ThemeConfig } from '@/types/store'

const idSchema = z.union([z.string(), z.number()]).transform(String)

const numericSchema = z.union([z.number(), z.string(), z.null()]).transform((value) => {
  if (value === null || value === '') return 0
  const parsed = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(parsed) ? parsed : 0
})

const apiPaymentMethodSchema = z
  .object({
    enabled: z.boolean(),
  })
  .passthrough()

// Accept any shape here (z.unknown) so a missing/null/unexpected theme_config
// can never fail store parsing; it is narrowed separately in parseThemeConfig.
const apiStoreSchema = z
  .object({
    id: idSchema,
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    logo_url: z.string().nullable().optional(),
    banner_url: z.string().nullable().optional(),
    payment_methods: z.record(apiPaymentMethodSchema).optional(),
    theme_config: z.unknown().optional(),
  })
  .passthrough()

const apiThemeConfigSchema = z
  .object({
    template: z.string().optional(),
    colors: z
      .object({
        primary: z.string().optional(),
        background: z.string().optional(),
        text: z.string().optional(),
      })
      .passthrough()
      .optional(),
    productCard: z.string().optional(),
  })
  .passthrough()

function parseThemeConfig(raw: unknown): ThemeConfig | undefined {
  if (!raw || typeof raw !== 'object') return undefined

  const parsed = apiThemeConfigSchema.safeParse(raw)
  if (!parsed.success) return undefined

  const { template, colors, productCard } = parsed.data

  return {
    template:
      template === 'boutique' || template === 'modern' ? template : 'classic',
    colors: colors
      ? { primary: colors.primary, background: colors.background, text: colors.text }
      : undefined,
    productCard:
      productCard === 'minimal' || productCard === 'bold' ? productCard : 'classic',
  }
}

type ApiCategory = {
  id: string
  store_id?: string
  parent_id?: string | null
  name: string
  image_url?: string | null
  sort_order?: number
  is_active?: boolean
  description?: string | null
  subcategories?: ApiCategory[]
}

const apiCategorySchema: z.ZodType<ApiCategory, z.ZodTypeDef, unknown> = z.lazy(() =>
  z
    .object({
      id: idSchema,
      store_id: idSchema.optional(),
      parent_id: idSchema.nullable().optional(),
      name: z.string(),
      image_url: z.string().nullable().optional(),
      sort_order: numericSchema.optional(),
      is_active: z.boolean().optional(),
      description: z.string().nullable().optional(),
      subcategories: z.array(apiCategorySchema).optional(),
    })
    .passthrough(),
)

const apiVariantSchema = z
  .object({
    id: idSchema,
    product_id: idSchema,
    name: z.string(),
    options: z.record(z.string()).optional().default({}),
    price_delta: numericSchema.optional(),
    stock_qty: numericSchema.optional(),
    sku: z.string().nullable().optional(),
    image_url: z.string().nullable().optional(),
    is_active: z.boolean().optional(),
    sort_order: numericSchema.optional(),
    compare_at_price: numericSchema.nullable().optional(),
    mark_as_sold: z.boolean().optional(),
    soldout: z.boolean().optional(),
    sold_out: z.boolean().optional(),
    mark_as_non_inventory: z.boolean().optional(),
  })
  .passthrough()

const apiProductSchema = z
  .object({
    id: idSchema,
    store_id: idSchema.optional(),
    category_id: idSchema.nullable().optional(),
    sku: z.string().nullable().optional(),
    slug: z.string().optional(),
    name: z.string(),
    description: z.string().nullable().optional(),
    base_price: numericSchema.optional(),
    compare_at_price: numericSchema.nullable().optional(),
    price: numericSchema.optional(),
    track_inventory: z.boolean().optional(),
    stock_qty: numericSchema.optional(),
    stock: numericSchema.optional(),
    quantity: numericSchema.optional(),
    images: z.array(z.string()).nullable().optional(),
    image_urls: z.array(z.string()).optional(),
    thumbnail_url: z.string().nullable().optional(),
    is_active: z.boolean().optional(),
    sort_order: numericSchema.optional(),
    status: z.string().optional(),
    mark_as_sold: z.boolean().optional(),
    soldout: z.boolean().optional(),
    sold_out: z.boolean().optional(),
    mark_as_non_inventory: z.boolean().optional(),
    variants: z.array(apiVariantSchema).optional().default([]),
  })
  .passthrough()

const apiCatalogDataSchema = z
  .object({
    store: apiStoreSchema.optional(),
    categories: z.array(apiCategorySchema).optional().default([]),
    products: z.array(apiProductSchema).optional().default([]),
  })
  .passthrough()

const apiCatalogSuccessSchema = z.object({
  success: z.literal(true),
  data: apiCatalogDataSchema,
})

const apiStoreSuccessSchema = z.object({
  success: z.literal(true),
  data: apiStoreSchema,
})

// The live store endpoint nests the store under `data.store` alongside other
// fields (e.g. `subdomainUrl`), so support that shape too.
const apiStoreNestedSuccessSchema = z.object({
  success: z.literal(true),
  data: z
    .object({
      store: apiStoreSchema,
    })
    .passthrough(),
})

const apiAddressSchema = z
  .object({
    name: z.string().optional(),
    phone_number: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    postcode: z.string().optional(),
  })
  .passthrough()

const apiCustomerSchema = z
  .object({
    name: z.string().optional(),
    phone_number: z.string().optional(),
    addresses: z.array(apiAddressSchema).optional(),
    shipping_addresses: z.array(apiAddressSchema).optional(),
    shipping_address: apiAddressSchema.optional(),
  })
  .passthrough()

const apiCustomerByPhoneDataSchema = z
  .object({
    customer: apiCustomerSchema.optional(),
    addresses: z.array(apiAddressSchema).optional(),
  })
  .passthrough()

const apiCustomerByPhoneSuccessSchema = z.object({
  success: z.literal(true),
  data: apiCustomerByPhoneDataSchema,
})

const apiOrderDataSchema = z
  .object({
    id: idSchema.optional(),
    order_id: idSchema.optional(),
    order_number: z.string().optional(),
  })
  .passthrough()

const apiOrderSuccessSchema = z.object({
  success: z.literal(true),
  data: apiOrderDataSchema.optional(),
  order_id: idSchema.optional(),
  orderId: idSchema.optional(),
})

const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z
    .object({
      message: z.string(),
      code: z.string().optional(),
    })
    .optional(),
})

export class AishopyApiError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'AishopyApiError'
    this.code = code
  }
}

function mapPaymentMethods(
  methods: Record<string, z.infer<typeof apiPaymentMethodSchema>> | undefined,
): StorePaymentMethods | undefined {
  if (!methods) return undefined

  return Object.fromEntries(
    Object.entries(methods).map(([key, value]) => {
      const raw = value as Record<string, unknown>
      const asString = (field: string) =>
        typeof raw[field] === 'string' ? (raw[field] as string) : undefined
      return [
        key,
        {
          enabled: value.enabled,
          vpa: asString('vpa'),
          displayName: asString('display_name'),
          qrImageUrl: asString('qr_image_url'),
        },
      ]
    }),
  )
}

function mapStore(apiStore: z.infer<typeof apiStoreSchema>): Store {
  return {
    id: apiStore.id,
    name: apiStore.name,
    slug: apiStore.slug,
    description: apiStore.description ?? undefined,
    logoUrl: apiStore.logo_url ?? undefined,
    bannerUrl: apiStore.banner_url ?? undefined,
    paymentMethods: mapPaymentMethods(apiStore.payment_methods),
    themeConfig: parseThemeConfig(apiStore.theme_config),
  }
}

function resolveSoldOut(apiEntity: {
  soldout?: boolean
  sold_out?: boolean
  mark_as_sold?: boolean
}): boolean {
  return apiEntity.soldout === true || apiEntity.sold_out === true || apiEntity.mark_as_sold === true
}

function resolveStore(
  storeSlug: string,
  apiStore: z.infer<typeof apiStoreSchema> | undefined,
  storeId: string,
): Store {
  if (apiStore) {
    return mapStore(apiStore)
  }

  return {
    id: storeId,
    name: storeSlug,
    slug: storeSlug,
  }
}

function bySortOrder(a: { sort_order?: number }, b: { sort_order?: number }): number {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0)
}

function mapCategory(apiCategory: ApiCategory): Category {
  const subcategories = (apiCategory.subcategories ?? [])
    .filter(isActiveCategory)
    .sort(bySortOrder)
    .map(mapCategory)

  return {
    id: apiCategory.id,
    name: apiCategory.name,
    parentId: apiCategory.parent_id ?? undefined,
    imageUrl: apiCategory.image_url ?? undefined,
    sortOrder: apiCategory.sort_order ?? 0,
    subcategories: subcategories.length > 0 ? subcategories : undefined,
  }
}

function resolveImageUrls(apiProduct: z.infer<typeof apiProductSchema>): string[] {
  const images = apiProduct.images?.filter(Boolean) ?? []
  if (images.length > 0) return images
  if (apiProduct.image_urls?.length) return apiProduct.image_urls
  if (apiProduct.thumbnail_url) return [apiProduct.thumbnail_url]
  return []
}

function mapCompareAtPrice(value: number | undefined): number | undefined {
  if (!value || value <= 0) return undefined
  return value
}

function mapVariant(
  apiVariant: z.infer<typeof apiVariantSchema>,
  basePrice: number,
): ProductVariant {
  const priceDelta = apiVariant.price_delta ?? 0

  return {
    id: apiVariant.id,
    productId: apiVariant.product_id,
    name: apiVariant.name,
    options: apiVariant.options ?? {},
    priceDelta,
    price: basePrice + priceDelta,
    compareAtPrice: mapCompareAtPrice(apiVariant.compare_at_price ?? undefined),
    stock: apiVariant.stock_qty ?? 0,
    sku: apiVariant.sku ?? '',
    imageUrl: apiVariant.image_url ?? undefined,
    isActive: apiVariant.is_active !== false,
    markAsSold: resolveSoldOut(apiVariant),
    markAsNonInventory: apiVariant.mark_as_non_inventory ?? false,
  }
}

function mapProduct(
  apiProduct: z.infer<typeof apiProductSchema>,
  store: Store,
  categories: Category[],
): Product {
  const categoryId = apiProduct.category_id ?? ''
  const categoryName =
    categories.find((category) => category.id === categoryId)?.name ?? 'Uncategorized'

  const basePrice = apiProduct.base_price ?? apiProduct.price ?? 0
  const variants = (apiProduct.variants ?? [])
    .filter((variant) => variant.is_active !== false)
    .sort(bySortOrder)
    .map((variant) => mapVariant(variant, basePrice))

  const slug =
    apiProduct.slug?.trim() ||
    `${slugify(apiProduct.name)}${apiProduct.id ? `-${apiProduct.id}` : ''}`

  const product: Product = {
    id: apiProduct.id,
    storeId: apiProduct.store_id ?? store.id,
    sku: apiProduct.sku ?? '',
    slug,
    name: apiProduct.name,
    description: apiProduct.description ?? '',
    price: basePrice,
    compareAtPrice: mapCompareAtPrice(apiProduct.compare_at_price ?? undefined),
    stock: apiProduct.stock_qty ?? apiProduct.stock ?? apiProduct.quantity ?? 0,
    trackInventory: apiProduct.track_inventory ?? true,
    markAsSold: resolveSoldOut(apiProduct),
    markAsNonInventory: apiProduct.mark_as_non_inventory ?? false,
    categoryId,
    categoryName,
    imageUrls: resolveImageUrls(apiProduct),
    variants,
  }

  if (variants.length > 0) {
    product.stock = variants
      .filter(isVariantPurchasable)
      .reduce((total, variant) => (variant.markAsNonInventory ? total : total + variant.stock), 0)
  }

  return product
}

function isActiveCategory(category: ApiCategory): boolean {
  return category.is_active !== false
}

function isActiveProduct(product: z.infer<typeof apiProductSchema>): boolean {
  if (product.is_active === false) return false
  if (product.status && product.status !== 'active') return false
  return true
}

function buildCatalogUrl(storeSlug: string, params: CatalogQueryParams = {}): URL {
  const url = new URL(`${AISHOPY_API_URL}/api/public/catalog`)

  if (params.categoryId) url.searchParams.set('category_id', params.categoryId)
  if (params.productId) url.searchParams.set('product_id', params.productId)
  if (params.sort) url.searchParams.set('sort', params.sort)
  if (params.minPrice !== undefined && params.minPrice > 0) {
    url.searchParams.set('min_price', String(params.minPrice))
  }
  if (params.maxPrice !== undefined && params.maxPrice > 0) {
    url.searchParams.set('max_price', String(params.maxPrice))
  }

  return url
}

export async function fetchPublicCatalog(
  storeSlug: string,
  params: CatalogQueryParams = {},
): Promise<Catalog> {
  const url = buildCatalogUrl(storeSlug, params)

  const response = await fetch(url.toString(), {
    headers: {
      'X-Store-Slug': storeSlug,
    },
    cache: 'no-store',
  })

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new AishopyApiError('Invalid response from catalog API')
  }

  const errorResult = apiErrorSchema.safeParse(body)
  if (errorResult.success) {
    throw new AishopyApiError(
      errorResult.data.error?.message ?? 'Catalog request failed',
      errorResult.data.error?.code,
    )
  }

  if (!response.ok) {
    throw new AishopyApiError(`Catalog API returned ${response.status}`)
  }

  const successResult = apiCatalogSuccessSchema.safeParse(body)
  if (!successResult.success) {
    throw new AishopyApiError('Unexpected catalog API response format')
  }

  const { data } = successResult.data
  const storeId =
    data.store?.id ?? data.products[0]?.store_id ?? data.categories[0]?.store_id ?? ''

  const store = resolveStore(storeSlug, data.store, storeId)
  const categories = data.categories.filter(isActiveCategory).sort(bySortOrder).map(mapCategory)
  // Flatten the tree (parents + subcategories) so products in any nested
  // category can still resolve their category name.
  const flatCategories = flattenCategories(categories)
  const products = data.products
    .filter(isActiveProduct)
    .sort(bySortOrder)
    .map((product) => mapProduct(product, store, flatCategories))

  return { store, categories, products }
}

async function fetchPublicApi(
  storeSlug: string,
  path: string,
  init: RequestInit = {},
): Promise<{ response: Response; body: unknown }> {
  const url = `${AISHOPY_API_URL}${path}`
  const response = await fetch(url, {
    ...init,
    headers: {
      'X-Store-Slug': storeSlug,
      ...init.headers,
    },
    cache: 'no-store',
  })

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new AishopyApiError(`Invalid response from ${path}`)
  }

  return { response, body }
}

function parseApiError(body: unknown, fallback: string): never {
  const errorResult = apiErrorSchema.safeParse(body)
  if (errorResult.success) {
    throw new AishopyApiError(
      errorResult.data.error?.message ?? fallback,
      errorResult.data.error?.code,
    )
  }
  throw new AishopyApiError(fallback)
}

export async function fetchPublicStore(storeSlug: string): Promise<Store> {
  const { response, body } = await fetchPublicApi(storeSlug, '/api/public/store')

  const errorResult = apiErrorSchema.safeParse(body)
  if (errorResult.success) {
    throw new AishopyApiError(
      errorResult.data.error?.message ?? 'Store request failed',
      errorResult.data.error?.code,
    )
  }

  if (response.status === 404) {
    throw new AishopyApiError('Store not found', 'STORE_NOT_RESOLVED')
  }

  if (!response.ok) {
    throw new AishopyApiError(`Store API returned ${response.status}`)
  }

  const nested = apiStoreNestedSuccessSchema.safeParse(body)
  if (nested.success) {
    return mapStore(nested.data.data.store)
  }

  const wrapped = apiStoreSuccessSchema.safeParse(body)
  if (wrapped.success) {
    return mapStore(wrapped.data.data)
  }

  const direct = apiStoreSchema.safeParse(body)
  if (direct.success) {
    return mapStore(direct.data)
  }

  throw new AishopyApiError('Unexpected store API response format')
}

function mapShippingAddress(address: z.infer<typeof apiAddressSchema>): ShippingAddress {
  return {
    name: address.name ?? '',
    phone_number: address.phone_number ?? '',
    address: address.address ?? '',
    city: address.city ?? '',
    district: address.district ?? '',
    state: address.state ?? '',
    postcode: address.postcode ?? '',
  }
}

export async function fetchCustomerByPhone(
  storeSlug: string,
  phoneNumber: string,
): Promise<{ exists: boolean; addresses: ShippingAddress[]; name?: string }> {
  const url = new URL(`${AISHOPY_API_URL}/api/public/customers/by-phone`)
  url.searchParams.set('phone', phoneNumber)

  const { response, body } = await fetchPublicApi(storeSlug, `${url.pathname}${url.search}`)

  if (response.status === 404) {
    return { exists: false, addresses: [] }
  }

  const errorResult = apiErrorSchema.safeParse(body)
  if (errorResult.success) {
    if (errorResult.data.error?.code === 'CUSTOMER_NOT_FOUND') {
      return { exists: false, addresses: [] }
    }
    throw new AishopyApiError(
      errorResult.data.error?.message ?? 'Customer lookup failed',
      errorResult.data.error?.code,
    )
  }

  if (!response.ok) {
    throw new AishopyApiError(`Customer API returned ${response.status}`)
  }

  const wrapped = apiCustomerByPhoneSuccessSchema.safeParse(body)
  if (wrapped.success) {
    const { customer, addresses: topLevelAddresses } = wrapped.data.data
    const addresses = [
      ...(topLevelAddresses ?? []).map(mapShippingAddress),
      ...(customer?.shipping_addresses ?? []).map(mapShippingAddress),
      ...(customer?.addresses ?? []).map(mapShippingAddress),
      ...(customer?.shipping_address ? [mapShippingAddress(customer.shipping_address)] : []),
    ].filter((address) => address.address.trim().length > 0)

    return {
      exists: Boolean(customer || addresses.length > 0),
      addresses,
      name: customer?.name,
    }
  }

  const customerOnly = apiCustomerSchema.safeParse(body)
  if (customerOnly.success) {
    const addresses = [
      ...(customerOnly.data.shipping_addresses ?? []).map(mapShippingAddress),
      ...(customerOnly.data.addresses ?? []).map(mapShippingAddress),
      ...(customerOnly.data.shipping_address
        ? [mapShippingAddress(customerOnly.data.shipping_address)]
        : []),
    ].filter((address) => address.address.trim().length > 0)

    return {
      exists: addresses.length > 0 || Boolean(customerOnly.data.name),
      addresses,
      name: customerOnly.data.name,
    }
  }

  return { exists: false, addresses: [] }
}

function resolveOrderId(body: z.infer<typeof apiOrderSuccessSchema>): string {
  return (
    body.data?.order_id ??
    body.data?.id ??
    body.data?.order_number ??
    body.order_id ??
    body.orderId ??
    ''
  )
}

export async function createPublicOrder(
  storeSlug: string,
  payload: {
    shippingAddress: ShippingAddress
    items: CartOrderItem[]
    paymentMethod: string
  },
): Promise<OrderCreateResponse> {
  const { response, body } = await fetchPublicApi(storeSlug, '/api/public/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shipping_address: payload.shippingAddress,
      items: payload.items.map((item) => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
      })),
      payment_method: payload.paymentMethod,
    }),
  })

  const errorResult = apiErrorSchema.safeParse(body)
  if (errorResult.success) {
    throw new AishopyApiError(
      errorResult.data.error?.message ?? 'Order creation failed',
      errorResult.data.error?.code,
    )
  }

  if (!response.ok) {
    throw new AishopyApiError(`Order API returned ${response.status}`)
  }

  const successResult = apiOrderSuccessSchema.safeParse(body)
  if (successResult.success) {
    const orderId = resolveOrderId(successResult.data)
    if (!orderId) {
      throw new AishopyApiError('Order created but no order ID returned')
    }
    return { success: true, orderId }
  }

  const fallback = z.object({ orderId: idSchema }).safeParse(body)
  if (fallback.success) {
    return { success: true, orderId: fallback.data.orderId }
  }

  throw new AishopyApiError('Unexpected order API response format')
}
