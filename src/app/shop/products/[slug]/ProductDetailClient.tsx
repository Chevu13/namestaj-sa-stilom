'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingCart, Check, Truck, ChevronLeft } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

const availabilityMap = {
  in_stock: { label: 'Na stanju', color: 'text-green-700', bg: 'bg-green-50' },
  out_of_stock: { label: 'Rasprodato', color: 'text-red-700', bg: 'bg-red-50' },
  on_order: { label: 'Po narudžbi', color: 'text-amber-700', bg: 'bg-amber-50' },
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const images = product.images || []
  const mainImg = images[selectedImg]?.url

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const avail = availabilityMap[product.availability]

  return (
    <div className="min-h-screen bg-warm-50 pt-[72px]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-8">
          <Link href="/shop" className="hover:text-charcoal-900">Početna</Link>
          <span>/</span>
          <Link href="/shop/products" className="hover:text-charcoal-900">Proizvodi</Link>
          {product.category && (
            <><span>/</span>
            <Link href={"/shop/products?category="+product.category.slug} className="hover:text-charcoal-900">{product.category.name}</Link></>
          )}
          <span>/</span>
          <span className="text-charcoal-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-warm-50 flex items-center justify-center min-h-[280px]">
              {mainImg ? (
                <Image src={mainImg} alt={product.name} width={900} height={900} className="w-full h-auto object-contain max-h-[520px]" unoptimized />
              ) : (
                <div className="flex items-center justify-center h-64 bg-warm-200 w-full">
                  <span className="text-warm-400">Bez slike</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImg(i)}
                    className={"relative w-20 h-20 overflow-hidden border-2 transition-colors " + (selectedImg === i ? 'border-charcoal-900' : 'border-transparent hover:border-cream-300')}
                  >
                    <Image src={img.url} alt={img.alt || product.name} fill className="object-contain" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-[10px] tracking-[3px] uppercase text-cream-500 mb-3">{product.category?.name}</p>
            <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-4xl md:text-5xl font-light text-charcoal-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <p style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-3xl font-light text-charcoal-900">
                {formatPrice(product.price)}
              </p>
              <span className={"text-xs px-2.5 py-1 rounded-sm " + avail.bg + " " + avail.color}>
                {avail.label}
              </span>
            </div>

            <p className="text-charcoal-600 text-sm leading-relaxed mb-8">{product.description}</p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {product.material && (
                <div className="bg-white p-3">
                  <p className="text-[9px] tracking-[2px] uppercase text-cream-500 mb-1">Materijal</p>
                  <p className="text-sm text-charcoal-800">{product.material}</p>
                </div>
              )}
              {product.dimensions && (
                <div className="bg-white p-3">
                  <p className="text-[9px] tracking-[2px] uppercase text-cream-500 mb-1">Dimenzije</p>
                  <p className="text-sm text-charcoal-800">{product.dimensions}</p>
                </div>
              )}
              {product.color && (
                <div className="bg-white p-3">
                  <p className="text-[9px] tracking-[2px] uppercase text-cream-500 mb-1">Boja</p>
                  <p className="text-sm text-charcoal-800">{product.color}</p>
                </div>
              )}
            </div>

            {/* Quantity + Cart */}
            {product.availability !== 'out_of_stock' && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-warm-300">
                  <button onClick={() => setQty(Math.max(1, qty-1))} className="w-10 h-10 flex items-center justify-center hover:bg-warm-100 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty(qty+1)} className="w-10 h-10 flex items-center justify-center hover:bg-warm-100 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className={"flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium tracking-wide transition-all duration-300 " + (added ? 'bg-green-700 text-white' : 'bg-charcoal-900 text-cream-100 hover:bg-charcoal-700')}
                >
                  {added ? <><Check size={16} /> Dodato u korpu</> : <><ShoppingCart size={16} /> Dodaj u korpu</>}
                </button>
              </div>
            )}

            <Link href="/shop/cart" className="text-sm text-charcoal-500 hover:text-charcoal-900 underline underline-offset-4 mb-8 w-fit">
              Pogledajte korpu
            </Link>

            {/* Delivery info */}
            <div className="border-t border-warm-200 pt-6 flex items-start gap-3">
              <Truck size={16} className="text-cream-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal-900">
                  {product.price >= 30000 ? 'Besplatna dostava' : 'Dostava: 1.500 RSD'}
                </p>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  {product.price >= 30000
                    ? 'Ovaj proizvod ispunjava uslov za besplatnu dostavu.'
                    : 'Besplatna dostava za porudžbine iznad 30.000 RSD.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
