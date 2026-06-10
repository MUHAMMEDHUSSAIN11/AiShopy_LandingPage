'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildCartItemId, type CartItem } from '@/types/cart'

type AddCartItemInput = Omit<CartItem, 'id' | 'quantity'> & {
  quantity?: number
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
            const newItem: CartItem = { ...item, id, quantity: quantityToAdd }
            return { storeSlug, items: [newItem] }
          }

          const existing = state.items.find((line) => line.id === id)
          if (existing) {
            return {
              storeSlug,
              items: state.items.map((line) =>
                line.id === id ? { ...line, quantity: line.quantity + quantityToAdd } : line,
              ),
            }
          }

          return {
            storeSlug,
            items: [...state.items, { ...item, id, quantity: quantityToAdd }],
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
          items: state.items.map((line) => (line.id === id ? { ...line, quantity } : line)),
        }))
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
