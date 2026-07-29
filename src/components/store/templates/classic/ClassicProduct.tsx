import ProductDetail from '@/components/store/ProductDetail'
import type { ProductTemplateProps } from '@/components/store/templates/types'

export default function ClassicProduct({ store, product }: ProductTemplateProps) {
  return <ProductDetail store={store} product={product} />
}
