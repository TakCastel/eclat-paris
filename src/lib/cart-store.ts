'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from './types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, size?: string | null) => void
  removeItem: (productId: string, size?: string | null) => void
  updateQuantity: (productId: string, quantity: number, size?: string | null) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size = null) => {
        const items = get().items
        const existing = items.find(
          (i) => i.product.id === product.id && i.selectedSize === size
        )
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id && i.selectedSize === size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
            isOpen: true,
          })
        } else {
          set({ items: [...items, { product, quantity: 1, selectedSize: size }], isOpen: true })
        }
      },

      removeItem: (productId, size = null) => {
        set({
          items: get().items.filter(
            (i) => !(i.product.id === productId && i.selectedSize === size)
          ),
        })
      },

      updateQuantity: (productId, quantity, size = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, size)
          return
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId && i.selectedSize === size ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'eclat-cart' }
  )
)
