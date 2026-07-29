import ProductPageSkeleton from '@/components/store/skeletons/ProductPageSkeleton'
import StoreThemedSkeleton from '@/components/store/skeletons/StoreThemedSkeleton'

export default function ProductLoading() {
  return (
    <StoreThemedSkeleton>
      <ProductPageSkeleton />
    </StoreThemedSkeleton>
  )
}
