import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Phone, Star } from 'lucide-react'
import { getFeaturedProducts, getCategories } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

export const revalidate = 60

const INSTAGRAM_URL = 'https://www.instagram.com/namestajsa_stilom/'

// Instagram SVG icon (lucide-react nema Instagram u ovoj verziji)
function InstagramIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

export default async function ShopHomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  const testimonials = [
    { name: 'Milica Petrović', city: 'Beograd', text: 'Ugaona garnitura Milano je tačno onakva kakva je opisana — izuzetno udobna i elegantna. Isporuka je bila brza i bezproblematična. Preporučujem!', stars: 5 },
    { name: 'Dragan Nikolić', city: 'Novi Sad', text: 'Kupio sam bračni krevet Aurora i prezadovoljan sam. Kvalitet materijala je odličan, a montaža je bila jednostavna. Definitivno kupovina vredna svake pare.', stars: 5 },
    { name: 'Ivana Jovanović', city: 'Niš', text: 'Krevet na razvlačenje Dual Comfort je savršen za moju garsonjeru. Danju sofa, noću krevet — bez kompromisa u komforu.', stars: 5 },
  ]

  return (
    <div className="bg-warm-50">

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=90"
          alt="Premium nameštaj"
          fill className="object-cover" priority unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <p className="text-cream-300 text-xs tracking-[4px] uppercase mb-6">Premium Nameštaj — Srbija</p>
              <h1 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-5xl md:text-7xl font-light text-white leading-[1.05] mb-6">
                Vaš dom,<br /><em className="italic text-cream-300">vaš stil.</em>
              </h1>
              <p className="text-white/75 text-base leading-relaxed mb-8">
                Ugaone garniture, bračni kreveti i kreveti na razvlačenje od premium materijala, sa isporukom na vašu adresu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop/products" className="inline-flex items-center gap-2 bg-white text-charcoal-900 px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-cream-100 transition-colors duration-300">
                  Pogledajte kolekciju <ArrowRight size={16} />
                </Link>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/50 text-white px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-white/10 transition-colors duration-300"
                >
                  <InstagramIcon size={15} />
                  Pratite nas na Instagramu
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/40 text-[10px] tracking-[3px] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── FREE DELIVERY BANNER ── */}
      <div className="bg-charcoal-900 text-cream-100 py-3.5 text-center">
        <p className="text-xs tracking-[3px] uppercase flex items-center justify-center gap-3">
          <Truck size={14} className="text-cream-400" />
          Besplatna dostava za porudžbine iznad 30.000 RSD
          <Truck size={14} className="text-cream-400" />
        </p>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[4px] uppercase text-cream-500 mb-3">Kolekcija</p>
          <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-4xl md:text-5xl font-light text-charcoal-900">
            Kategorije nameštaja
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={"/shop/products?category="+cat.slug} className="group relative overflow-hidden block">
              <div className="aspect-[4/5] relative overflow-hidden">
                {cat.image_url && (
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-2xl font-light text-white mb-2">{cat.name}</h3>
                  {cat.description && <p className="text-white/60 text-sm line-clamp-2">{cat.description}</p>}
                  <div className="mt-4 flex items-center gap-2 text-cream-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Pogledaj kolekciju <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] tracking-[4px] uppercase text-cream-500 mb-3">Izdvajamo</p>
              <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-4xl md:text-5xl font-light text-charcoal-900">Popularni proizvodi</h2>
            </div>
            <Link href="/shop/products" className="hidden md:flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors">
              Svi proizvodi <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => {
              const img = product.images?.[0]?.url
              return (
                <Link key={product.id} href={"/shop/products/"+product.slug} className="group">
                  <div className="relative overflow-hidden bg-warm-100 mb-4">
                    <div className="aspect-[4/5] relative overflow-hidden">
                      {img ? (
                        <Image src={img} alt={product.name} fill className="object-contain transition-transform duration-500 group-hover:scale-105 p-2" unoptimized />
                      ) : (
                        <div className="absolute inset-0 bg-warm-200 flex items-center justify-center">
                          <span className="text-warm-400 text-sm">Bez slike</span>
                        </div>
                      )}
                    </div>
                    {product.availability === 'on_order' && (
                      <div className="absolute top-3 left-3 bg-charcoal-900 text-cream-100 text-[9px] tracking-[2px] uppercase px-2.5 py-1">
                        Po narudžbi
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] tracking-[2px] uppercase text-cream-500 mb-1">{product.category?.name}</p>
                  <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-xl font-light text-charcoal-900 mb-1 group-hover:text-cream-500 transition-colors duration-200">{product.name}</h3>
                  <p className="text-charcoal-700 font-medium text-sm">{formatPrice(product.price)}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── LIFESTYLE BANNER — nameštaj u enterijeru ── */}
      <section className="relative h-[480px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1600&q=80"
          alt="Nameštaj sa Stilom enterijer"
          fill className="object-cover" unoptimized
        />
        <div className="absolute inset-0 bg-charcoal-900/50" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div>
            <p className="text-cream-300 text-xs tracking-[4px] uppercase mb-4">Naša filozofija</p>
            <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-4xl md:text-6xl font-light text-white leading-tight mb-6 max-w-2xl mx-auto">
              &ldquo;Nameštaj koji traje generacijama&rdquo;
            </h2>
            <Link href="/shop/products" className="inline-flex items-center gap-2 border border-white/60 text-white px-8 py-3.5 text-sm tracking-wide hover:bg-white hover:text-charcoal-900 transition-all duration-300">
              Istražite kolekciju
            </Link>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Truck, title: 'Besplatna dostava', desc: 'Za sve porudžbine iznad 30.000 RSD. Isporuka u roku od 3–7 radnih dana.' },
            { icon: Shield, title: 'Garancija kvaliteta', desc: 'Svi naši proizvodi dolaze sa 2 godine garancije. Koristimo samo premium materijale.' },
            { icon: Phone, title: 'Stručna podrška', desc: 'Naš tim je dostupan za sve savete pri odabiru nameštaja koji odgovara vašem prostoru.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 border border-cream-300 mx-auto mb-5 flex items-center justify-center">
                <Icon size={20} className="text-cream-500" />
              </div>
              <h3 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-2xl font-light text-charcoal-900 mb-3">{title}</h3>
              <p className="text-charcoal-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[4px] uppercase text-cream-500 mb-3">Utisci</p>
            <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-4xl md:text-5xl font-light text-charcoal-900">Šta kažu naši kupci</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-8">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({length:t.stars}).map((_,i) => <Star key={i} size={14} fill="#d4a96a" stroke="none" />)}
                </div>
                <p className="text-charcoal-600 text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <p style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-charcoal-900 font-medium text-lg">{t.name}</p>
                <p className="text-cream-500 text-xs tracking-wide">{t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="bg-charcoal-900 py-20 text-center px-6">
        <p className="text-cream-500 text-xs tracking-[4px] uppercase mb-4">Kontakt</p>
        <h2 style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-4xl md:text-5xl font-light text-cream-100 mb-4">Imate pitanje?</h2>
        <p className="text-cream-400 text-sm mb-8 max-w-md mx-auto">
          Naš tim je tu da vam pomogne pri odabiru savršenog komada nameštaja. Javite nam se.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+381628599179" className="inline-flex items-center gap-2 bg-cream-500 text-white px-8 py-3.5 text-sm font-medium hover:bg-cream-400 transition-colors">
            <Phone size={16} />
            +381 62 859 9179
          </a>
          <a
            href="https://wa.me/381628599179?text=Zdravo%21%20Zanima%20me%20vi%C5%A1e%20informacija%20o%20name%C5%A1taju."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 text-sm font-medium hover:bg-[#1fb855] transition-colors"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-charcoal-700 text-cream-200 px-8 py-3.5 text-sm font-medium hover:border-cream-400 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            Instagram
          </a>
        </div>
      </section>

    </div>
  )
}
