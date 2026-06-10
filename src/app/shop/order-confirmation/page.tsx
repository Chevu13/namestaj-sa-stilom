'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Package, Phone, Mail } from 'lucide-react'
import { Order } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Suspense } from 'react'

function ConfirmationContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) { setLoading(false); return }
    fetch('/api/orders?number=' + orderNumber)
      .then(r => r.json())
      .then(data => { setOrder(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [orderNumber])

  if (loading) return (
    <div className="min-h-screen bg-warm-50 pt-[72px] flex items-center justify-center">
      <div className="animate-pulse text-charcoal-400">Učitavanje...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-warm-50 pt-[72px]">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-green-700" />
        </div>

        <p className="text-[10px] tracking-[3px] uppercase text-cream-500 mb-3">Potvrda</p>
        <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-4xl md:text-5xl font-light text-charcoal-900 mb-4">
          Hvala na porudžbini!
        </h1>
        <p className="text-charcoal-600 text-sm mb-8">
          Vaša porudžbina je uspešno primljena. Poslaćemo vam potvrdu na email, a naš tim će vas kontaktirati uskoro.
        </p>

        {order && (
          <div className="bg-white p-6 text-left mb-8">
            <div className="text-center mb-6 pb-6 border-b border-warm-200">
              <p className="text-xs text-charcoal-500 tracking-wide uppercase mb-1">Broj porudžbine</p>
              <p style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-3xl font-light text-charcoal-900 tracking-wider">
                {order.order_number}
              </p>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-[2px] uppercase text-charcoal-500 mb-3">Naručeni proizvodi</p>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-charcoal-700">{item.product_name} <span className="text-charcoal-400">x{item.quantity}</span></span>
                      <span className="font-medium">{formatPrice(item.product_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-warm-100 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500">Dostava</span>
                <span>{order.delivery_cost === 0 ? 'Besplatno' : formatPrice(order.delivery_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-xl font-light">Ukupno</span>
                <span style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-xl font-light">{formatPrice(order.total_amount)}</span>
              </div>
            </div>

            <div className="bg-warm-50 p-4 text-sm">
              <p className="font-medium text-charcoal-900 mb-1">Adresa isporuke</p>
              <p className="text-charcoal-600">{order.customer_name}</p>
              <p className="text-charcoal-600">{order.address}, {order.city} {order.postal_code}</p>
            </div>
          </div>
        )}

        {/* Contact info */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <div className="flex items-center gap-2 text-sm text-charcoal-600">
            <Phone size={14} className="text-cream-500" />
            +381 60 123 4567
          </div>
          <div className="flex items-center gap-2 text-sm text-charcoal-600">
            <Mail size={14} className="text-cream-500" />
            vukrajovic95@gmail.com
          </div>
        </div>

        <Link href="/shop" className="inline-flex items-center gap-2 bg-charcoal-900 text-cream-100 px-8 py-3.5 text-sm hover:bg-charcoal-700 transition-colors">
          Nazad na početnu
        </Link>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-50 pt-[72px]" />}>
      <ConfirmationContent />
    </Suspense>
  )
}
