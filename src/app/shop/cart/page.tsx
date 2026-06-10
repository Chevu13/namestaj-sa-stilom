'use client'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, Truck, ArrowRight } from 'lucide-react'
import { formatPrice, FREE_DELIVERY_THRESHOLD, DELIVERY_COST } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, deliveryCost, total } = useCartStore()
  const sub = subtotal()
  const delivery = deliveryCost()
  const tot = total()
  const remaining = FREE_DELIVERY_THRESHOLD - sub

  return (
    <div className="min-h-screen bg-warm-50 pt-[72px]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-8">
          <Link href="/shop" className="hover:text-charcoal-900">Početna</Link>
          <span>/</span>
          <span>Korpa</span>
        </div>

        <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-4xl md:text-5xl font-light text-charcoal-900 mb-10">Vaša korpa</h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-3xl font-light text-charcoal-600 mb-4">Korpa je prazna</p>
            <p className="text-charcoal-500 text-sm mb-8">Dodajte neke proizvode da biste nastavili sa kupovinom.</p>
            <Link href="/shop/products" className="inline-flex items-center gap-2 bg-charcoal-900 text-cream-100 px-8 py-3.5 text-sm hover:bg-charcoal-700 transition-colors">
              Pogledajte proizvode <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-6">
              {remaining > 0 && (
                <div className="bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
                  <Truck size={16} />
                  Dodajte još {formatPrice(remaining)} za besplatnu dostavu!
                </div>
              )}
              {delivery === 0 && (
                <div className="bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 flex items-center gap-2">
                  <Truck size={16} />
                  Čestitamo! Imate besplatnu dostavu.
                </div>
              )}

              {items.map(({ product, quantity }) => {
                const img = product.images?.[0]?.url
                return (
                  <div key={product.id} className="bg-white flex gap-5 p-5">
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-warm-100">
                      {img ? (
                        <Image src={img} alt={product.name} fill className="object-contain p-1" unoptimized />
                      ) : (
                        <div className="absolute inset-0 bg-warm-200" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[9px] tracking-[2px] uppercase text-cream-500 mb-0.5">{product.category?.name}</p>
                        <Link href={"/shop/products/"+product.slug} style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-lg font-light text-charcoal-900 hover:text-cream-500 transition-colors">
                          {product.name}
                        </Link>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-warm-200">
                          <button onClick={() => updateQuantity(product.id, quantity-1)} className="w-8 h-8 flex items-center justify-center hover:bg-warm-100">
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm">{quantity}</span>
                          <button onClick={() => updateQuantity(product.id, quantity+1)} className="w-8 h-8 flex items-center justify-center hover:bg-warm-100">
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="font-medium text-charcoal-900 text-sm">{formatPrice(product.price * quantity)}</p>
                        <button onClick={() => removeItem(product.id)} className="text-charcoal-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 sticky top-24">
                <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-2xl font-light text-charcoal-900 mb-6">Rezime porudžbine</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-600">Međuzbir</span>
                    <span>{formatPrice(sub)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-600">Dostava</span>
                    <span className={delivery === 0 ? 'text-green-700 font-medium' : ''}>
                      {delivery === 0 ? 'Besplatno' : formatPrice(delivery)}
                    </span>
                  </div>
                  <div className="border-t border-warm-200 pt-3 flex justify-between">
                    <span style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-xl font-light">Ukupno</span>
                    <span style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-xl font-light">{formatPrice(tot)}</span>
                  </div>
                </div>
                <Link href="/shop/checkout" className="w-full flex items-center justify-center gap-2 bg-charcoal-900 text-cream-100 py-3.5 text-sm font-medium hover:bg-charcoal-700 transition-colors">
                  Nastavi na narudžbinu <ArrowRight size={16} />
                </Link>
                <Link href="/shop/products" className="w-full flex items-center justify-center mt-3 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors">
                  Nastavi kupovinu
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
