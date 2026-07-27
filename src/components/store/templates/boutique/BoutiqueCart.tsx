'use client'

import CartPageContent from '@/components/store/CartPageContent'
import MarketplaceHeader from '@/components/store/templates/boutique/MarketplaceHeader'
import type { CartTemplateProps } from '@/components/store/templates/types'

export default function BoutiqueCart({ store }: CartTemplateProps) {
  return (
    <div className="cart-boutique min-h-screen bg-store-bg-shell template-page-enter">
      <MarketplaceHeader store={store} />
      <CartPageContent store={store} layout="boutique" showHeader={false} embedded />
    </div>
  )
}
