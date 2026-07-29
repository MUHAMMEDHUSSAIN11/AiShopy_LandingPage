'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CartIcon from '@/components/store/CartIcon'
import { useStoreHref } from '@/contexts/PreviewContext'
import { useCartStore } from '@/stores/cart-store'
import type { Store } from '@/types/store'

type MarketplaceHeaderProps = {
  store: Store
}

export default function MarketplaceHeader({ store }: MarketplaceHeaderProps) {
  const router = useRouter()
  const getHref = useStoreHref()
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, line) => sum + line.quantity, 0),
  )

  return (
    <header className="sticky top-0 z-40 border-b border-store-border bg-store-bg-shell/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={getHref('/')} className="flex min-w-0 items-center gap-3">
          {store.logoUrl ? (
            <Image
              src={store.logoUrl}
              alt={store.name}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full border border-store-border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-store-primary-soft text-base font-bold text-store-primary">
              {store.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="marketplace-title truncate text-lg font-bold text-store-text sm:text-xl">
                {store.name}
              </h1>
              <span className="shrink-0 rounded-full bg-store-primary-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-store-primary">
                Marketplace
              </span>
            </div>
          </div>
        </Link>
        <CartIcon
          count={cartCount}
          onClick={() => router.push(getHref('/cart'))}
          className="text-store-text hover:bg-store-subtle"
          badgeRingClassName="ring-store-bg-shell"
        />
      </div>
    </header>
  )
}
