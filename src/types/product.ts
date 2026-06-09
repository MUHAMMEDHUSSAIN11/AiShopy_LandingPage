export interface Product {
  id: string
  storeId: string
  sku: string
  slug: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrls: string[]
}
