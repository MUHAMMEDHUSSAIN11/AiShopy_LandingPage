'use client'

import Link from 'next/link'
import CheckoutExperience, { type CheckoutLineItem } from '@/components/store/CheckoutExperience'
import { useCartStore } from '@/stores/cart-store'
import type { Store } from '@/types/store'

type CartCheckoutFormProps = {
  store: Store
}

export default function CartCheckoutForm({ store }: CartCheckoutFormProps) {
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
      emptyState={
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-lg font-medium text-gray-700">Your cart is empty</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Continue Shopping
          </Link>
        </div>
      }
    />
  )
}
