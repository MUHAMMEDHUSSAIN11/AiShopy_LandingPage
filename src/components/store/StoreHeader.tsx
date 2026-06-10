'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CartIcon from '@/components/store/CartIcon'
import { useCartStore } from '@/stores/cart-store'
import type { Store } from '@/types/store'

type StoreHeaderProps = {
  store: Store
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  const router = useRouter()
  const cartCount = useCartStore((state) => state.totalCount())

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {store.logoUrl ? (
            <Image
              src={store.logoUrl}
              alt={store.name}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-base font-bold text-brand-green">
              {store.name.charAt(0)}
            </div>
          )}
          <h1 className="truncate text-lg font-bold text-brand-dark sm:text-xl">{store.name}</h1>
        </Link>
        <CartIcon count={cartCount} onClick={() => router.push('/cart')} />
      </div>
    </header>
  )
}
