import ProductDetailClient from '@/components/store/ProductDetailClient'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

type ProductDetailProps = {
  store: Store
  product: Product
}

export default function ProductDetail({ store, product }: ProductDetailProps) {
  return <ProductDetailClient store={store} product={product} />
}
