import Link from 'next/link'
import { notFound } from 'next/navigation'
import BackLink from '@/components/store/BackLink'
import CheckoutForm from '@/components/store/CheckoutForm'
import ErrorMessage from '@/components/store/ErrorMessage'
import StoreTheme from '@/components/store/StoreTheme'
import {
  findVariantById,
  isProductInStock,
  isVariantPurchasable,
} from '@/lib/product-utils'
import { getStoreSlugFromHeaders } from '@/lib/server-api'
import { getProductById } from '@/lib/product'
import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'

type CheckoutPageProps = {
  params: Promise<{ productId: string }>
  searchParams: Promise<{ variant?: string }>
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const storeSlug = await getStoreSlugFromHeaders()
  const { productId } = await params
  const { variant: variantId } = await searchParams

  if (!storeSlug) {
    notFound()
  }

  try {
    const store = await getStoreBySlug(storeSlug)
    const product = await getProductById(storeSlug, productId)

    if (!product || product.storeId !== store.id) {
      notFound()
    }

    const selectedVariant = variantId ? findVariantById(product, variantId) : undefined
    if (variantId && !selectedVariant) {
      notFound()
    }

    const inStock = selectedVariant
      ? isVariantPurchasable(selectedVariant)
      : isProductInStock(product)

    if (!inStock) {
      return (
        <StoreTheme themeConfig={store.themeConfig}>
          <div className="flex min-h-screen items-center justify-center bg-store-bg-shell px-4">
            <ErrorMessage
              title="Out of stock"
              message="This product is currently unavailable."
              action={
                <Link
                  href={`/product/${product.slug}`}
                  className="inline-block rounded-full bg-store-primary px-6 py-2.5 text-sm font-semibold text-white"
                >
                  Back to product
                </Link>
              }
            />
          </div>
        </StoreTheme>
      )
    }

    return (
      <StoreTheme themeConfig={store.themeConfig}>
        <div className="min-h-screen bg-store-bg-shell">
          <header className="border-b border-gray-100 bg-store-bg">
            <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
              <BackLink href={`/product/${product.slug}`} label="Back to product" />
            </div>
          </header>

          <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            <h1 className="text-2xl font-bold text-store-text">Checkout</h1>
            <p className="mt-1 text-sm text-gray-500">Complete your order request</p>
            <div className="mt-8">
              <CheckoutForm store={store} product={product} selectedVariant={selectedVariant} />
            </div>
          </main>
        </div>
      </StoreTheme>
    )
  } catch (error) {
    if (error instanceof StoreNotFoundError) {
      notFound()
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <ErrorMessage
          title="Something went wrong"
          message="We couldn't load checkout. Please refresh and try again."
        />
      </div>
    )
  }
}
