'use client'
import { useState, useEffect, useRef } from 'react'
import { Product, Category } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Pencil, Trash2, Plus, X, Check, Upload, Loader2, ImageIcon } from 'lucide-react'
import Image from 'next/image'

const availabilityOptions = [
  { value: 'in_stock', label: 'Na stanju' },
  { value: 'out_of_stock', label: 'Rasprodato' },
  { value: 'on_order', label: 'Po narudžbi' },
]

const emptyForm = {
  name: '', description: '', price: '', category_id: '',
  material: '', dimensions: '', color: '', availability: 'in_stock', featured: false,
  images: [{ url: '', alt: '' }, { url: '', alt: '' }, { url: '', alt: '' }],
}

// Single image slot with drag-drop + file upload + URL fallback
function ImageSlot({
  index,
  url,
  onChange,
  onClear,
}: {
  index: number
  url: string
  onChange: (url: string) => void
  onClear: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Samo slike (JPG, PNG, WebP)'); return }
    if (file.size > 8 * 1024 * 1024) { setError('Max 8 MB'); return }
    setError('')
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        onChange(data.url)
      } else {
        setError(data.error || 'Upload nije uspeo')
      }
    } catch {
      setError('Greška pri uploadu')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  const label = index === 0 ? 'Glavna slika' : `Slika ${index + 1}`

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-600">{label}{index === 0 && <span className="text-red-400 ml-1">*</span>}</p>

      {url ? (
        /* Preview */
        <div className="relative group rounded overflow-hidden border border-gray-200 bg-gray-50">
          <div className="relative w-full aspect-[4/3]">
            <Image src={url} alt={label} fill className="object-cover" unoptimized />
          </div>
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded cursor-pointer transition-colors
            aspect-[4/3] flex flex-col items-center justify-center gap-2
            ${drag ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'}
          `}
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="text-blue-500 animate-spin" />
              <span className="text-xs text-gray-500">Upload...</span>
            </>
          ) : (
            <>
              <Upload size={22} className="text-gray-400" />
              <span className="text-xs text-gray-500 text-center px-2">
                Prevuci sliku ovde<br />
                <span className="text-gray-400">ili klikni da izabereš</span>
              </span>
              <span className="text-[10px] text-gray-400">JPG, PNG, WebP — max 8 MB</span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }}
          />
        </div>
      )}

      {/* URL fallback */}
      <input
        type="text"
        placeholder="ili zalepi URL slike..."
        value={url}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded px-3 py-1.5 text-xs outline-none focus:border-gray-400 text-gray-500 placeholder:text-gray-300"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<any>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [pd, cd] = await Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ])
    setProducts(Array.isArray(pd) ? pd : [])
    setCategories(Array.isArray(cd) ? cd : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const startNew = () => {
    setForm({ ...emptyForm, images: [{ url: '', alt: '' }, { url: '', alt: '' }, { url: '', alt: '' }] })
    setEditing('new')
    setTimeout(() => document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const startEdit = (p: Product) => {
    const imgs = [...(p.images || [])].slice(0, 3)
    while (imgs.length < 3) imgs.push({ url: '', alt: '' } as any)
    setForm({ ...p, price: String(p.price), images: imgs.map(i => ({ url: i.url, alt: i.alt || '' })) })
    setEditing(p.id)
    setTimeout(() => document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const save = async () => {
    if (!form.name.trim()) { alert('Unesite naziv'); return }
    if (!form.price) { alert('Unesite cenu'); return }
    setSaving(true)
    const payload = {
      ...form,
      price: parseFloat(form.price),
      images: form.images.filter((i: any) => i.url.trim()),
    }
    await fetch('/api/products', {
      method: editing === 'new' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing === 'new' ? payload : { ...payload, id: editing }),
    })
    setEditing(null)
    setSaving(false)
    load()
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Obrisati ovaj proizvod?')) return
    await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const setImgUrl = (idx: number, url: string) => {
    const imgs = [...form.images]
    imgs[idx] = { ...imgs[idx], url }
    setForm({ ...form, images: imgs })
  }

  const clearImg = (idx: number) => setImgUrl(idx, '')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Proizvodi</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} proizvoda</p>
        </div>
        <button onClick={startNew} className="flex items-center gap-2 bg-[#1a1814] text-white px-4 py-2 text-sm rounded hover:bg-[#3d382e] transition-colors">
          <Plus size={16} /> Novi proizvod
        </button>
      </div>

      {/* ── FORM ── */}
      {editing && (
        <div id="product-form" className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-800">
              {editing === 'new' ? '+ Novi proizvod' : 'Uredi proizvod'}
            </h2>
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — text fields */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Naziv *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Cena (RSD) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Kategorija</label>
                  <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-500">
                    <option value="">Izaberite...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Opis</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-500 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Materijal</label>
                  <input value={form.material || ''} onChange={e => setForm({ ...form, material: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Dimenzije</label>
                  <input value={form.dimensions || ''} onChange={e => setForm({ ...form, dimensions: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Boja</label>
                  <input value={form.color || ''} onChange={e => setForm({ ...form, color: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Dostupnost</label>
                  <select value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-500">
                    {availabilityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center gap-2 pt-1">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-gray-800" />
                  <label htmlFor="featured" className="text-sm text-gray-600 cursor-pointer">Istaknuti proizvod (prikazuje se na homepageu)</label>
                </div>
              </div>
            </div>

            {/* Right — images */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Slike proizvoda</p>
              {[0, 1, 2].map(idx => (
                <ImageSlot
                  key={idx}
                  index={idx}
                  url={form.images[idx]?.url || ''}
                  onChange={(url) => setImgUrl(idx, url)}
                  onClear={() => clearImg(idx)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 text-sm rounded hover:bg-green-600 disabled:opacity-60 transition-colors">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? 'Snima...' : 'Sačuvaj'}
            </button>
            <button onClick={() => setEditing(null)} className="border border-gray-200 px-6 py-2.5 text-sm rounded hover:bg-gray-50 transition-colors">
              Otkaži
            </button>
          </div>
        </div>
      )}

      {/* ── TABLE ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Učitavanje...</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            Nema proizvoda. Kliknite "+ Novi proizvod" da dodate prvi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium">Proizvod</th>
                  <th className="text-left px-5 py-3 font-medium">Kategorija</th>
                  <th className="text-left px-5 py-3 font-medium">Cena</th>
                  <th className="text-left px-5 py-3 font-medium">Dostupnost</th>
                  <th className="text-left px-5 py-3 font-medium">Istaknut</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const img = product.images?.[0]?.url
                  return (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            {img
                              ? <Image src={img} alt={product.name} fill className="object-cover" unoptimized />
                              : <div className="absolute inset-0 flex items-center justify-center"><ImageIcon size={16} className="text-gray-300" /></div>
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            {product.color && <p className="text-xs text-gray-400">{product.color}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{product.category?.name || '—'}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900">{formatPrice(product.price)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                          product.availability === 'in_stock' ? 'bg-green-100 text-green-800' :
                          product.availability === 'on_order' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {availabilityOptions.find(o => o.value === product.availability)?.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{product.featured ? '✓' : ''}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(product)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Uredi">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Obriši">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
