'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Product, Category } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  products: Product[]
  allProducts: Product[]  // svi proizvodi, za tačne brojeve u filterima
  categories: Category[]
  activeCategorySlug?: string
}

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'name_asc'

const sortOptions = [
  { value: 'default',    label: 'Podrazumevano' },
  { value: 'price_asc',  label: 'Cena: od najjeftinije' },
  { value: 'price_desc', label: 'Cena: od najskuplje' },
  { value: 'name_asc',   label: 'Naziv: A–Z' },
]

const availabilityLabels: Record<string, string> = {
  in_stock:    'Na stanju',
  on_order:    'Po narudžbi',
  out_of_stock:'Rasprodato',
}

function FilterSection({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="border-b border-warm-200 last:border-0">
      <button onClick={onToggle} className="w-full flex items-center justify-between py-4 text-left">
        <span className="text-sm font-medium text-charcoal-900">{title}</span>
        {open ? <ChevronUp size={15} className="text-charcoal-500" /> : <ChevronDown size={15} className="text-charcoal-500" />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

export default function ProductsClient({ products, allProducts, categories, activeCategorySlug }: Props) {
  const router = useRouter()
  const [sort, setSort] = useState<SortKey>('default')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [openSections, setOpenSections] = useState({ kategorija: true, cena: true, boja: true, dostupnost: true })
  const toggleSection = (k: keyof typeof openSections) => setOpenSections(p => ({ ...p, [k]: !p[k] }))

  const activeCategory = categories.find(c => c.slug === activeCategorySlug)

  // Price bounds from ALL products shown
  const minPrice = products.length ? Math.min(...products.map(p => p.price)) : 0
  const maxPrice = products.length ? Math.max(...products.map(p => p.price)) : 1000000
  const range = priceRange ?? [minPrice, maxPrice]

  // Unique colors
  const allColors = useMemo(() => {
    const s = new Set<string>()
    products.forEach(p => { if (p.color) s.add(p.color) })
    return Array.from(s).sort()
  }, [products])

  const toggleColor = (c: string) =>
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const toggleAvail = (a: string) =>
    setSelectedAvailability(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

  const filtered = useMemo(() => products.filter(p => {
    if (selectedColors.length > 0 && (!p.color || !selectedColors.includes(p.color))) return false
    if (selectedAvailability.length > 0 && !selectedAvailability.includes(p.availability)) return false
    if (p.price < range[0] || p.price > range[1]) return false
    return true
  }), [products, selectedColors, selectedAvailability, range])

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sort === 'price_asc')  return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    if (sort === 'name_asc')   return a.name.localeCompare(b.name, 'sr')
    return 0
  }), [filtered, sort])

  const activeFilterCount =
    selectedColors.length +
    selectedAvailability.length +
    (priceRange && (priceRange[0] > minPrice || priceRange[1] < maxPrice) ? 1 : 0)

  const clearAll = () => {
    setSelectedColors([])
    setSelectedAvailability([])
    setPriceRange(null)
  }

  const FilterPanel = () => (
    <div>
      {/* Active filters */}
      {activeFilterCount > 0 && (
        <div className="pb-4 border-b border-warm-200 mb-1">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-charcoal-600 uppercase tracking-wider">Aktivni filteri</span>
            <button onClick={clearAll} className="text-xs text-cream-500 underline underline-offset-2">Obriši sve</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedColors.map(c => (
              <button key={c} onClick={() => toggleColor(c)} className="flex items-center gap-1 bg-charcoal-900 text-cream-100 text-xs px-2 py-0.5 hover:bg-charcoal-700">
                {c} <X size={9} />
              </button>
            ))}
            {selectedAvailability.map(a => (
              <button key={a} onClick={() => toggleAvail(a)} className="flex items-center gap-1 bg-charcoal-900 text-cream-100 text-xs px-2 py-0.5 hover:bg-charcoal-700">
                {availabilityLabels[a]} <X size={9} />
              </button>
            ))}
            {priceRange && (priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
              <button onClick={() => setPriceRange(null)} className="flex items-center gap-1 bg-charcoal-900 text-cream-100 text-xs px-2 py-0.5 hover:bg-charcoal-700">
                Cena <X size={9} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Kategorija */}
      <FilterSection title="Kategorija" open={openSections.kategorija} onToggle={() => toggleSection('kategorija')}>
        <div className="space-y-1">
          <button
            onClick={() => router.push('/shop/products')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${!activeCategorySlug ? 'bg-charcoal-900 text-cream-100' : 'bg-warm-50 text-charcoal-700 hover:bg-warm-100'}`}
          >
            <span>Sve kategorije</span>
            <span className={`text-xs ${!activeCategorySlug ? 'text-cream-400' : 'text-charcoal-400'}`}>({allProducts.length})</span>
          </button>
          {categories.map(cat => {
            const cnt = allProducts.filter(p => p.category_id === cat.id).length
            const active = activeCategorySlug === cat.slug
            return (
              <button
                key={cat.id}
                onClick={() => router.push('/shop/products?category=' + cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${active ? 'bg-charcoal-900 text-cream-100' : 'bg-warm-50 text-charcoal-700 hover:bg-warm-100'}`}
              >
                <span>{cat.name}</span>
                <span className={`text-xs ${active ? 'text-cream-400' : 'text-charcoal-400'}`}>({cnt})</span>
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* Cena */}
      <FilterSection title="Cena" open={openSections.cena} onToggle={() => toggleSection('cena')}>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-charcoal-500">
            <span>{formatPrice(range[0])}</span>
            <span>{formatPrice(range[1])}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[9px] uppercase tracking-wider text-charcoal-400 block mb-1">Od</label>
              <input
                type="number" step={1000} min={minPrice} max={range[1]}
                value={range[0]}
                onChange={e => setPriceRange([Math.max(minPrice, Math.min(Number(e.target.value), range[1])), range[1]])}
                className="w-full border border-warm-200 px-2 py-1.5 text-xs outline-none focus:border-charcoal-700 bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="text-[9px] uppercase tracking-wider text-charcoal-400 block mb-1">Do</label>
              <input
                type="number" step={1000} min={range[0]} max={maxPrice}
                value={range[1]}
                onChange={e => setPriceRange([range[0], Math.min(maxPrice, Math.max(Number(e.target.value), range[0]))])}
                className="w-full border border-warm-200 px-2 py-1.5 text-xs outline-none focus:border-charcoal-700 bg-white"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Boja */}
      {allColors.length > 0 && (
        <FilterSection title="Boja" open={openSections.boja} onToggle={() => toggleSection('boja')}>
          <div className="space-y-1">
            {allColors.map(color => {
              const cnt = products.filter(p => p.color === color).length
              const active = selectedColors.includes(color)
              return (
                <button key={color} onClick={() => toggleColor(color)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${active ? 'bg-charcoal-900 text-cream-100' : 'bg-warm-50 text-charcoal-700 hover:bg-warm-100'}`}>
                  <span>{color}</span>
                  <span className={`text-xs ${active ? 'text-cream-400' : 'text-charcoal-400'}`}>({cnt})</span>
                </button>
              )
            })}
          </div>
        </FilterSection>
      )}

      {/* Dostupnost */}
      <FilterSection title="Dostupnost" open={openSections.dostupnost} onToggle={() => toggleSection('dostupnost')}>
        <div className="space-y-1">
          {(['in_stock', 'on_order', 'out_of_stock'] as const).map(av => {
            const cnt = products.filter(p => p.availability === av).length
            if (cnt === 0) return null
            const active = selectedAvailability.includes(av)
            return (
              <button key={av} onClick={() => toggleAvail(av)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${active ? 'bg-charcoal-900 text-cream-100' : 'bg-warm-50 text-charcoal-700 hover:bg-warm-100'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${av === 'in_stock' ? 'bg-green-500' : av === 'on_order' ? 'bg-amber-400' : 'bg-red-400'}`} />
                  <span>{availabilityLabels[av]}</span>
                </div>
                <span className={`text-xs ${active ? 'text-cream-400' : 'text-charcoal-400'}`}>({cnt})</span>
              </button>
            )
          })}
        </div>
      </FilterSection>
    </div>
  )

  return (
    <div className="min-h-screen bg-warm-50 pt-[72px]">
      {/* Page header */}
      <div className="bg-white border-b border-warm-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-3">
            <Link href="/shop" className="hover:text-charcoal-900">Početna</Link>
            <span>/</span>
            {activeCategory ? (
              <>
                <Link href="/shop/products" className="hover:text-charcoal-900">Proizvodi</Link>
                <span>/</span>
                <span className="text-charcoal-900">{activeCategory.name}</span>
              </>
            ) : (
              <span className="text-charcoal-900">Svi proizvodi</span>
            )}
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }} className="text-4xl md:text-5xl font-light text-charcoal-900">
            {activeCategory ? activeCategory.name : 'Svi proizvodi'}
          </h1>
          {activeCategory?.description && (
            <p className="text-charcoal-500 text-sm mt-2 max-w-xl">{activeCategory.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-charcoal-500">
              <span className="font-medium text-charcoal-900">{sorted.length}</span> {sorted.length === 1 ? 'proizvod' : 'proizvoda'}
              {activeFilterCount > 0 && <span className="text-charcoal-400"> (filtrirano)</span>}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-xs text-cream-500 flex items-center gap-1 underline underline-offset-2">
                <X size={11} /> Obriši filtere
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter btn */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-warm-300 bg-white px-3 py-2 text-sm text-charcoal-700 hover:border-charcoal-400 transition-colors"
            >
              <SlidersHorizontal size={15} />
              Filteri {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-charcoal-500 hidden sm:block whitespace-nowrap">Sortiraj:</label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortKey)}
                  className="appearance-none bg-white border border-warm-300 text-sm text-charcoal-700 px-3 py-2 pr-8 outline-none focus:border-charcoal-700 cursor-pointer"
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={14} className="text-charcoal-600" />
                <span className="text-xs font-medium tracking-[2px] uppercase text-charcoal-700">Filteri</span>
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {sorted.length === 0 ? (
              <div className="text-center py-24">
                <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }} className="text-3xl font-light text-charcoal-400 mb-3">
                  Nema rezultata
                </p>
                <p className="text-charcoal-400 text-sm mb-6">Probajte da promenite ili obrišete filtere.</p>
                <button onClick={clearAll} className="text-sm text-cream-500 underline underline-offset-2">
                  Obriši sve filtere
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                {sorted.map(product => {
                  const img = product.images?.[0]?.url
                  return (
                    <Link key={product.id} href={`/shop/products/${product.slug}`} className="group">
                      <div className="relative overflow-hidden bg-warm-100 mb-4">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          {img ? (
                            <Image src={img} alt={product.name} fill className="object-contain transition-transform duration-700 group-hover:scale-105 p-2" unoptimized />
                          ) : (
                            <div className="absolute inset-0 bg-warm-200 flex items-center justify-center">
                              <span className="text-warm-400 text-xs">Bez slike</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.availability === 'on_order' && (
                            <span className="bg-amber-600 text-white text-[9px] tracking-[2px] uppercase px-2 py-0.5">Po narudžbi</span>
                          )}
                          {product.availability === 'out_of_stock' && (
                            <span className="bg-charcoal-700 text-cream-200 text-[9px] tracking-[2px] uppercase px-2 py-0.5">Rasprodato</span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100">
                          <span className="bg-white text-charcoal-900 text-xs font-medium px-4 py-2 tracking-wide">
                            Pogledaj detalje
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] tracking-[2px] uppercase text-cream-500 mb-1.5">{product.category?.name}</p>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }} className="text-xl font-light text-charcoal-900 mb-1 group-hover:text-cream-500 transition-colors duration-200 leading-tight">
                        {product.name}
                      </h3>
                      {product.color && <p className="text-xs text-charcoal-400 mb-1.5">{product.color}</p>}
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-charcoal-800">{formatPrice(product.price)}</p>
                        {product.availability === 'in_stock' && (
                          <span className="flex items-center gap-1 text-[10px] text-green-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Na stanju
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 inset-y-0 w-80 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-warm-200">
              <span className="text-sm font-medium text-charcoal-900">Filteri</span>
              <button onClick={() => setMobileFiltersOpen(false)}><X size={20} className="text-charcoal-600" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterPanel />
            </div>
            <div className="px-5 py-4 border-t border-warm-200">
              <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-charcoal-900 text-cream-100 py-3 text-sm font-medium hover:bg-charcoal-700 transition-colors">
                Prikaži {sorted.length} {sorted.length === 1 ? 'proizvod' : 'proizvoda'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
