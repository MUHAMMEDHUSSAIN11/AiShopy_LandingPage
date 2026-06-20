'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildCartItemId, getCartItemMaxQuantity, type CartItem } from '@/types/cart'

type AddCartItemInput = Omit<CartItem, 'id' | 'quantity'> & {
  quantity?: number
}

function clampToStock(item: CartItem, quantity: number): number {
  const safeQuantity = Math.max(1, quantity)
  const max = getCartItemMaxQuantity(item)
  if (max === undefined) return safeQuantity
  return Math.min(safeQuantity, Math.max(1, max))
}

const ADD_DEBOUNCE_MS = 600
let lastAddKey: string | null = null
let lastAddAt = 0

function shouldSkipDuplicateAdd(id: string): boolean {
  const now = Date.now()
  if (lastAddKey === id && now - lastAddAt < ADD_DEBOUNCE_MS) {
    return true
  }
  lastAddKey = id
  lastAddAt = now
  return false
}

type CartState = {
  storeSlug: string | null
  items: CartItem[]
  addItem: (storeSlug: string, item: AddCartItemInput) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  reconcileItems: (available: Omit<CartItem, 'quantity'>[]) => void
  clearCart: () => void
  totalCount: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      storeSlug: null,
      items: [],

      addItem: (storeSlug, item) => {
        const id = buildCartItemId(item.productId, item.variantId)
        if (shouldSkipDuplicateAdd(id)) return

        const quantityToAdd = item.quantity ?? 1

        set((state) => {
          if (state.storeSlug && state.storeSlug !== storeSlug) {
            const seed: CartItem = { ...item, id, quantity: 0 }
            const newItem: CartItem = { ...seed, quantity: clampToStock(seed, quantityToAdd) }
            return { storeSlug, items: [newItem] }
          }

          const existing = state.items.find((line) => line.id === id)
          if (existing) {
            return {
              storeSlug,
              items: state.items.map((line) =>
                line.id === id
                  ? { ...line, quantity: clampToStock(line, line.quantity + quantityToAdd) }
                  : line,
              ),
            }
          }

          const seed: CartItem = { ...item, id, quantity: 0 }
          return {
            storeSlug,
            items: [...state.items, { ...seed, quantity: clampToStock(seed, quantityToAdd) }],
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((line) => line.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }

        set((state) => ({
          items: state.items.map((line) =>
            line.id === id ? { ...line, quantity: clampToStock(line, quantity) } : line,
          ),
        }))
      },

      reconcileItems: (available) => {
        set((state) => {
          if (state.items.length === 0) return state

          const map = new Map(available.map((entry) => [entry.id, entry]))

          const items = state.items.reduce<CartItem[]>((acc, item) => {
            const fresh = map.get(item.id)
            // Drop items that no longer exist or are no longer purchasable
            // (deleted in the DB, deactivated, or sold out).
            if (!fresh) return acc

            // Refresh price/stock/name from the catalog and clamp quantity.
            const merged: CartItem = { ...fresh, quantity: item.quantity }
            acc.push({ ...merged, quantity: clampToStock(merged, item.quantity) })
            return acc
          }, [])

          return { items, storeSlug: items.length === 0 ? null : state.storeSlug }
        })
      },

      clearCart: () => set({ items: [], storeSlug: null }),

      totalCount: () => get().items.reduce((sum, line) => sum + line.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, line) => sum + line.price * line.quantity, 0),
    }),
    {
      name: 'aishopy-cart',
    },
  ),
)
