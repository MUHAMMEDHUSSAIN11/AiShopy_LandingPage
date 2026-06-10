export interface ProductVariant {
  id: string
  productId: string
  name: string
  options: Record<string, string>
  price: number
  priceDelta: number
  compareAtPrice?: number
  stock: number
  sku: string
  imageUrl?: string
  isActive: boolean
  markAsSold: boolean
  markAsNonInventory: boolean
}

export interface Product {
  id: string
  storeId: string
  sku: string
  slug: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  stock: number
  trackInventory: boolean
  markAsSold: boolean
  markAsNonInventory: boolean
  categoryId: string
  categoryName: string
  imageUrls: string[]
  variants: ProductVariant[]
}
