'use client'

import { useEffect } from 'react'
import { buildAvailableCartItems } from '@/lib/cart-sync'
import { useCartStore } from '@/stores/cart-store'
import type { Product } from '@/types/product'

/**
 * Keeps the persisted cart in sync with the live catalog. Pass `products` when
 * the catalog is already available (e.g. the storefront page); otherwise the
 * hook fetches the full catalog itself (e.g. a direct visit to /cart).
 *
 * Items that are no longer purchasable are removed; the rest get fresh
 * price/stock/name and clamped quantities.
 */
export function useCartReconcile(storeSlug: string, products?: Product[]): void {
  const reconcileItems = useCartStore((state) => state.reconcileItems)

  useEffect(() => {
    let cancelled = false

    async function run() {
      let list = products

      if (!list) {
        try {
          const response = await fetch(
            `/api/catalog?storeSlug=${encodeURIComponent(storeSlug)}`,
          )
          if (!response.ok) return
          const data = (await response.json()) as { products?: Product[] }
          list = data.products ?? []
        } catch {
          // Network error — leave the cart untouched rather than wiping it.
          return
        }
      }

      if (cancelled || !list) return
      reconcileItems(buildAvailableCartItems(list))
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [storeSlug, products, reconcileItems])
}
