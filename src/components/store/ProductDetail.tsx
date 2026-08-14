import ProductDetailClient from '@/components/store/ProductDetailClient'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

type ProductDetailProps = {
  store: Store
  product: Product
  initialVariantId?: string
}

export default function ProductDetail({ store, product, initialVariantId }: ProductDetailProps) {
  return (
    <ProductDetailClient store={store} product={product} initialVariantId={initialVariantId} />
  )
}
