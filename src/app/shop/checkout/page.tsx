'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { ArrowRight, Truck } from 'lucide-react'
import Image from 'next/image'

const fields = [
  { name: 'customer_name',  label: 'Ime i prezime', type: 'text',  required: true,  colSpan: 2 },
  { name: 'customer_phone', label: 'Broj telefona', type: 'tel',   required: true,  colSpan: 1 },
  { name: 'customer_email', label: 'Email adresa',  type: 'email', required: false, colSpan: 1 },
  { name: 'address',        label: 'Adresa',        type: 'text',  required: true,  colSpan: 2 },
  { name: 'city',           label: 'Grad',          type: 'text',  required: true,  colSpan: 1 },
  { name: 'postal_code',    label: 'Poštanski broj', type: 'text', required: false, colSpan: 1 },
]

export default function CheckoutPage() {
  const { items, subtotal, deliveryCost, total, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    address: '', city: '', postal_code: '', notes: '',
  })

  const sub      = subtotal()
  const delivery = deliveryCost()
  const tot      = total()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customer_name.trim())  e.customer_name  = 'Obavezno polje'
    if (!form.customer_phone.trim()) e.customer_phone = 'Obavezno polje'
    if (!form.address.trim())        e.address        = 'Obavezno polje'
    if (!form.city.trim())           e.city           = 'Obavezno polje'
    if (form.customer_email && !form.customer_email.includes('@'))
      e.customer_email = 'Unesite validan email'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          customer_email: form.customer_email || 'nema@email.com',
          postal_code: form.postal_code || '00000',
          items: items.map(i => ({
            product_id: i.product.id,
            product_name: i.product.name,
            product_price: i.product.price,
            quantity: i.quantity,
          })),
          total_amount: tot,
          delivery_cost: delivery,
          source: 'website',
        }),
      })
      const data = await res.json()
      if (data.order_number) {
        clearCart()
        router.push('/shop/order-confirmation?order=' + data.order_number)
      } else {
        alert('Greška pri slanju porudžbine. Pokušajte ponovo.')
      }
    } catch {
      alert('Greška pri slanju porudžbine. Pokušajte ponovo.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen bg-warm-50 pt-[72px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-charcoal-500 mb-4">Korpa je prazna.</p>
        <Link href="/shop/products" className="text-sm underline">Nastavite kupovinu</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-warm-50 pt-[72px]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-8">
          <Link href="/shop" className="hover:text-charcoal-900">Početna</Link>
          <span>/</span>
          <Link href="/shop/cart" className="hover:text-charcoal-900">Korpa</Link>
          <span>/</span>
          <span>Narudžbina</span>
        </div>

        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          className="text-4xl md:text-5xl font-light text-charcoal-900 mb-10">
          Finalizujte narudžbinu
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6">
                <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  className="text-2xl font-light text-charcoal-900 mb-6">
                  Podaci za isporuku
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map(f => (
                    <div key={f.name} className={f.colSpan === 2 ? 'md:col-span-2' : ''}>
                      <label className="text-xs tracking-[1px] uppercase text-charcoal-600 mb-1.5 block">
                        {f.label}
                        {f.required
                          ? <span className="text-red-400 ml-1">*</span>
                          : <span className="text-charcoal-400 ml-1">(opciono)</span>
                        }
                      </label>
                      <input
                        type={f.type}
                        required={f.required}
                        value={(form as any)[f.name]}
                        onChange={e => {
                          setForm(prev => ({ ...prev, [f.name]: e.target.value }))
                          setErrors(prev => ({ ...prev, [f.name]: '' }))
                        }}
                        className={`w-full border px-3 py-2.5 text-sm outline-none focus:border-charcoal-900 transition-colors ${errors[f.name] ? 'border-red-400' : 'border-warm-300'}`}
                      />
                      {errors[f.name] && <p className="text-xs text-red-500 mt-1">{errors[f.name]}</p>}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-xs tracking-[1px] uppercase text-charcoal-600 mb-1.5 block">
                      Napomena <span className="text-charcoal-400">(opciono)</span>
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      rows={3}
                      className="w-full border border-warm-300 px-3 py-2.5 text-sm outline-none focus:border-charcoal-900 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white p-6">
                <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  className="text-2xl font-light text-charcoal-900 mb-4">
                  Način plaćanja
                </h2>
                <div className="border-2 border-charcoal-900 p-4 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-charcoal-900 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-charcoal-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">Plaćanje pouzećem</p>
                    <p className="text-xs text-charcoal-500">Plaćate kuriru pri preuzimanju paketa.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 sticky top-24">
                <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  className="text-2xl font-light text-charcoal-900 mb-5">
                  Vaša porudžbina
                </h2>
                <div className="space-y-4 mb-6">
                  {items.map(({ product, quantity }) => {
                    const img = product.images?.[0]?.url
                    return (
                      <div key={product.id} className="flex gap-3 items-start">
                        <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-warm-100">
                          {img && <Image src={img} alt={product.name} fill className="object-cover" unoptimized />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-charcoal-900 truncate">{product.name}</p>
                          <p className="text-xs text-charcoal-500">Kom: {quantity}</p>
                        </div>
                        <p className="text-sm font-medium flex-shrink-0">{formatPrice(product.price * quantity)}</p>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-warm-200 space-y-2 py-4">
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
                </div>
                <div className="border-t border-warm-200 pt-4 flex justify-between mb-6">
                  <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }} className="text-xl font-light">Ukupno</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }} className="text-xl font-light">{formatPrice(tot)}</span>
                </div>
                {delivery > 0 && (
                  <div className="flex items-center gap-2 bg-amber-50 p-3 mb-4 text-xs text-amber-800">
                    <Truck size={14} />
                    Dodajte još {formatPrice(30000 - sub)} za besplatnu dostavu
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-charcoal-900 text-cream-100 py-3.5 text-sm font-medium hover:bg-charcoal-700 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Slanje...' : <><ArrowRight size={16} /> Poručite</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
