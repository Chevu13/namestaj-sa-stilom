import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Truck, Users, Heart } from 'lucide-react'

export const metadata = {
  title: 'O nama — Nameštaj sa Stilom',
  description: 'Upoznajte nas — porodična firma sa tradicijom izrade premium nameštaja za vaš dom.',
}

export default function ONamaPage() {
  return (
    <div className="min-h-screen bg-warm-50 pt-[72px]">

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-charcoal-800">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
          alt="O nama" fill className="object-cover opacity-60" unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/40 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pb-10">
            <div className="flex items-center gap-2 text-xs text-cream-400/70 mb-3">
              <Link href="/shop" className="hover:text-cream-200 transition-colors">Početna</Link>
              <span>/</span>
              <span className="text-cream-200">O nama</span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              className="text-4xl md:text-5xl font-light text-white">O nama</h1>
          </div>
        </div>
      </div>

      {/* Priča */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-[10px] tracking-[4px] uppercase text-cream-500 mb-4">Naša priča</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              className="text-4xl md:text-5xl font-light text-charcoal-900 mb-6 leading-tight">
              Nameštaj koji se pravi sa ljubavlju
            </h2>
            <div className="space-y-4 text-charcoal-600 text-sm leading-relaxed">
              <p>
                Nameštaj sa Stilom je porodična firma sa dugogodišnjim iskustvom u izradi i prodaji premium nameštaja. Naša misija je jednostavna — svaki dom zaslužuje nameštaj koji je lep, trajan i udoban.
              </p>
              <p>
                Svaki komad koji prodajemo pažljivo biramo od proverenih proizvođača koji dele naše vrednosti — kvalitet materijala, preciznost izrade i poštovanje kupca.
              </p>
              <p>
                Ono što nas razlikuje je lični pristup svakom kupcu. Nismo samo prodavnica — mi smo vaši savetnici pri opremanju doma.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/shop/products"
                className="inline-flex items-center gap-2 bg-charcoal-900 text-cream-100 px-8 py-3.5 text-sm font-medium hover:bg-charcoal-700 transition-colors">
                Pogledajte kolekciju <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                alt="Naš showroom" fill className="object-cover" unoptimized
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white p-5 shadow-lg">
              <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                className="text-4xl font-light text-charcoal-900">10+</p>
              <p className="text-xs text-charcoal-500 tracking-wide">godina iskustva</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vrednosti */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[4px] uppercase text-cream-500 mb-3">Zašto mi</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              className="text-4xl font-light text-charcoal-900">Naše vrednosti</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award,  title: 'Kvalitet',         desc: 'Biramo samo nameštaj od premium materijala sa garancijom kvaliteta.' },
              { icon: Truck,  title: 'Besplatna dostava', desc: 'Isporuka na vašu adresu za porudžbine iznad 30.000 RSD.' },
              { icon: Users,  title: 'Lični pristup',    desc: 'Svaki kupac dobija punu pažnju i stručan savet pri odabiru.' },
              { icon: Heart,  title: 'Zadovoljstvo',     desc: 'Naš cilj je da svaki kupac bude potpuno zadovoljan svojom kupovinom.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 border border-cream-300 mx-auto mb-4 flex items-center justify-center">
                  <Icon size={20} className="text-cream-500" />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  className="text-xl font-light text-charcoal-900 mb-2">{title}</h3>
                <p className="text-sm text-charcoal-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal-900 py-16 text-center px-6">
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          className="text-4xl font-light text-cream-100 mb-4">
          Pronađite savršen nameštaj
        </h2>
        <p className="text-cream-400 text-sm mb-8 max-w-md mx-auto">
          Posetite našu kolekciju i pronađite nameštaj koji će vaš dom pretvoriti u prostor koji volite.
        </p>
        <Link href="/shop/products"
          className="inline-flex items-center gap-2 bg-cream-500 text-white px-8 py-3.5 text-sm font-medium hover:bg-cream-400 transition-colors">
          Pogledajte kolekciju <ArrowRight size={16} />
        </Link>
      </section>

    </div>
  )
}
