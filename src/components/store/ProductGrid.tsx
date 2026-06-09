import ProductCard from '@/components/store/ProductCard'
import type { Product } from '@/types/product'

type ProductGridProps = {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
        <p className="text-lg font-medium text-gray-700">No products available</p>
        <p className="mt-2 text-sm text-gray-500">Check back soon for new items.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
