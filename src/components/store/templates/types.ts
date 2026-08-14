import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

export type CatalogTemplateProps = {
  storeSlug: string
  store: Store
  categories: Category[]
  initialProducts: Product[]
  previewMode?: boolean
}

export type ProductTemplateProps = {
  store: Store
  product: Product
  initialVariantId?: string
}

export type CartTemplateProps = {
  store: Store
}

export type CheckoutTemplateProps = {
  store: Store
  previewMode?: boolean
}

export type OrderSuccessTemplateProps = {
  store: Store
  orderId?: string
}
