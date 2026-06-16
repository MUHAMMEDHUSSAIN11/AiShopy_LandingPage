'use client'

import CheckoutExperience, { type CheckoutLineItem } from '@/components/store/CheckoutExperience'
import { getDisplayPrice, getProductImages } from '@/lib/product-utils'
import type { Product, ProductVariant } from '@/types/product'
import type { Store } from '@/types/store'

type CheckoutFormProps = {
  store: Store
  product: Product
  selectedVariant?: ProductVariant
}

export default function CheckoutForm({ store, product, selectedVariant }: CheckoutFormProps) {
  const lineItem: CheckoutLineItem = {
    productId: product.id,
    variantId: selectedVariant?.id,
    name: product.name,
    variantName: selectedVariant?.name,
    price: getDisplayPrice(product, selectedVariant),
    quantity: 1,
    imageUrl: getProductImages(product, selectedVariant)[0],
  }

  return <CheckoutExperience store={store} items={[lineItem]} />
}
