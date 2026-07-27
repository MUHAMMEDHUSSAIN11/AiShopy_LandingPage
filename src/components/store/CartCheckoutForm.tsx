'use client'

import Link from 'next/link'
import CheckoutExperience, { type CheckoutLineItem } from '@/components/store/CheckoutExperience'
import { useStoreTemplate } from '@/contexts/StoreTemplateContext'
import { useStoreHref } from '@/contexts/PreviewContext'
import { useCartStore } from '@/stores/cart-store'
import type { Store } from '@/types/store'
import type { StoreTemplateId } from '@/types/store'

type CartCheckoutFormProps = {
  store: Store
  previewMode?: boolean
  layout?: StoreTemplateId
}

export default function CartCheckoutForm({ store, previewMode, layout: layoutProp }: CartCheckoutFormProps) {
  const getHref = useStoreHref()
  const layoutFromContext = useStoreTemplate()
  const layout = layoutProp ?? layoutFromContext
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  const lineItems: CheckoutLineItem[] = items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    name: item.name,
    variantName: item.variantName,
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.imageUrl || undefined,
  }))

  return (
    <CheckoutExperience
      store={store}
      items={lineItems}
      onOrderPlaced={clearCart}
      previewMode={previewMode}
      layout={layout}
      emptyState={
        <div className="rounded-2xl border border-dashed border-store-border bg-store-bg px-6 py-16 text-center">
          <p className="text-lg font-medium text-store-text">Your cart is empty</p>
          <Link
            href={getHref('/')}
            className="mt-4 inline-flex rounded-full bg-store-primary px-6 py-3 text-sm font-semibold text-white hover:bg-store-primary-hover"
          >
            Continue Shopping
          </Link>
        </div>
      }
    />
  )
}
