'use client'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Category } from '@/types'
import Image from 'next/image'

const INSTAGRAM_URL = 'https://www.instagram.com/namestajsa_stilom/'

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data) })
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-charcoal-900 text-cream-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image src="/logo.jpg" alt="Nameštaj sa Stilom" fill className="object-cover" />
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                className="text-2xl font-light text-cream-100">
                Nameštaj sa Stilom
              </h3>
            </div>
            <p className="text-cream-400 text-sm leading-relaxed max-w-xs mb-6">
              Vaš pouzdani partner za premium nameštaj. Donosimo komfor i eleganciju direktno u vaš dom — sa besplatnom isporukom za porudžbine iznad 30.000 RSD.
            </p>
            {/* Instagram link */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-cream-400 hover:text-cream-100 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 border border-charcoal-700 group-hover:border-cream-400 flex items-center justify-center transition-colors duration-200">
                <InstagramIcon size={15} />
              </div>
              <span className="text-sm">@namestajsa_stilom</span>
            </a>
          </div>

          {/* Categories from DB */}
          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase text-cream-500 mb-5">Kategorije</h4>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/shop/products?category=${cat.slug}`}
                    className="text-sm text-cream-400 hover:text-cream-100 transition-colors duration-200">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop/products"
                  className="text-sm text-cream-400 hover:text-cream-100 transition-colors duration-200">
                  Svi proizvodi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[3px] uppercase text-cream-500 mb-5">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-cream-500 mt-0.5 flex-shrink-0" />
                <a href="tel:+381628599179" className="text-sm text-cream-400 hover:text-cream-100 transition-colors">
                  +381 62 859 9179
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#d4a96a" className="mt-0.5 flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <a href="https://wa.me/381628599179?text=Zdravo%21%20Zanima%20me%20vi%C5%A1e%20informacija%20o%20name%C5%A1taju." target="_blank" rel="noopener noreferrer" className="text-sm text-cream-400 hover:text-cream-100 transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="text-cream-500 mt-0.5 flex-shrink-0" />
                <a href="mailto:vukrajovic95@gmail.com" className="text-sm text-cream-400 hover:text-cream-100 transition-colors">
                  vukrajovic95@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-cream-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-cream-400">Beograd, Srbija</span>
              </li>
              <li className="flex items-start gap-3">
                <InstagramIcon size={14} />
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-cream-400 hover:text-cream-100 transition-colors">
                  Instagram profil
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-charcoal-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream-600">© {new Date().getFullYear()} Nameštaj sa Stilom. Sva prava zadržana.</p>
          <p className="text-xs text-cream-600">Isporuka na teritoriji Srbije</p>
        </div>
      </div>
    </footer>
  )
}
