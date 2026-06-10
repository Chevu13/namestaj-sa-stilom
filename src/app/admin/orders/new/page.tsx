'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { formatPrice, generateOrderNumber, FREE_DELIVERY_THRESHOLD, DELIVERY_COST } from '@/lib/utils'
import { Trash2, Plus } from 'lucide-react'

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'telefon', label: 'Telefon' },
  { value: 'salon', label: 'Salon' },
]

export default function NewManualOrderPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '',
    address: '', city: '', postal_code: '', notes: '', source: 'telefon',
  })
  const [items, setItems] = useState<{ product: Product; quantity: number }[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')

  useEffect(() => {
    fetch('/api/products').then(r=>r.json()).then(data => setProducts(Array.isArray(data)?data:[]))
  }, [])

  const addItem = () => {
    const product = products.find(p => p.id === selectedProductId)
    if (!product) return
    const existing = items.find(i => i.product.id === product.id)
    if (existing) {
      setItems(items.map(i => i.product.id === product.id ? {...i, quantity: i.quantity+1} : i))
    } else {
      setItems([...items, { product, quantity: 1 }])
    }
    setSelectedProductId('')
  }

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : (subtotal > 0 ? DELIVERY_COST : 0)
  const total = subtotal + delivery

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) { alert('Dodajte bar jedan proizvod'); return }
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        customer_email: form.customer_email || 'manual@namestajsastilom.rs',
        address: form.address || 'Manuelna porudžbina',
        city: form.city || '-',
        postal_code: form.postal_code || '00000',
        items: items.map(i => ({ product_id: i.product.id, product_name: i.product.name, product_price: i.product.price, quantity: i.quantity })),
        total_amount: total,
        delivery_cost: delivery,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.order_number) router.push('/admin/orders')
    else alert('Greška: ' + JSON.stringify(data))
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Nova manuelna porudžbina</h1>
        <p className="text-sm text-gray-500 mt-1">Za porudžbine primljene telefonom, Instagramom ili u salonu</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer info */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Podaci o kupcu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name:'customer_name', label:'Ime i prezime', required: true },
              { name:'customer_phone', label:'Telefon', required: true },
              { name:'customer_email', label:'Email (opciono)' },
              { name:'address', label:'Adresa (opciono)' },
              { name:'city', label:'Grad (opciono)' },
              { name:'postal_code', label:'PTT (opciono)' },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs font-medium text-gray-600 block mb-1">{f.label}</label>
                <input
                  required={f.required}
                  value={(form as any)[f.name]}
                  onChange={e => setForm(prev => ({...prev, [f.name]: e.target.value}))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Izvor *</label>
              <select required value={form.source} onChange={e => setForm(f => ({...f, source: e.target.value}))} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400">
                {sourceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-600 block mb-1">Napomena</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Proizvodi</h2>
          <div className="flex gap-3 mb-4">
            <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400">
              <option value="">Izaberite proizvod...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}</option>)}
            </select>
            <button type="button" onClick={addItem} disabled={!selectedProductId} className="flex items-center gap-1 bg-gray-900 text-white px-4 py-2 text-sm rounded hover:bg-gray-700 disabled:opacity-40">
              <Plus size={14} /> Dodaj
            </button>
          </div>

          {items.length > 0 && (
            <div className="space-y-2">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400">{formatPrice(product.price)} / kom</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button type="button" onClick={() => setItems(items.map(i => i.product.id===product.id ? {...i, quantity:Math.max(1,i.quantity-1)} : i))} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900">-</button>
                      <span className="w-8 text-center text-sm">{quantity}</span>
                      <button type="button" onClick={() => setItems(items.map(i => i.product.id===product.id ? {...i, quantity:i.quantity+1} : i))} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900">+</button>
                    </div>
                    <span className="text-sm font-semibold w-24 text-right">{formatPrice(product.price*quantity)}</span>
                    <button type="button" onClick={() => setItems(items.filter(i => i.product.id !== product.id))} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200 space-y-1">
                <div className="flex justify-between text-sm text-gray-500"><span>Dostava</span><span>{delivery===0?'Besplatno':formatPrice(delivery)}</span></div>
                <div className="flex justify-between font-bold"><span>Ukupno</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-[#1a1814] text-white px-6 py-2.5 text-sm rounded hover:bg-[#3d382e] transition-colors disabled:opacity-60">
            {loading ? 'Snima...' : 'Sačuvaj porudžbinu'}
          </button>
          <button type="button" onClick={() => router.back()} className="border border-gray-200 px-6 py-2.5 text-sm rounded hover:bg-gray-50">
            Otkaži
          </button>
        </div>
      </form>
    </div>
  )
}
