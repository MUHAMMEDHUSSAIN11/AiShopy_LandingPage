import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

export interface Catalog {
  store: Store
  categories: Category[]
  products: Product[]
}

export type CatalogQueryParams = {
  categoryId?: string
  productId?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
}
