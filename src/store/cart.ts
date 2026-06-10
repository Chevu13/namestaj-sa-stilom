'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'
import { FREE_DELIVERY_THRESHOLD, DELIVERY_COST } from '@/lib/utils'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
  deliveryCost: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, { product, quantity }] }
        })
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        ),
      deliveryCost: () => {
        const sub = get().subtotal()
        return sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST
      },
      total: () => get().subtotal() + get().deliveryCost(),
    }),
    { name: 'namestaj-cart' }
  )
)
