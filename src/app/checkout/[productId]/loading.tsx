import CheckoutPageSkeleton from '@/components/store/skeletons/CheckoutPageSkeleton'
import StoreThemedSkeleton from '@/components/store/skeletons/StoreThemedSkeleton'

export default function CheckoutLoading() {
  return (
    <StoreThemedSkeleton>
      <CheckoutPageSkeleton />
    </StoreThemedSkeleton>
  )
}
