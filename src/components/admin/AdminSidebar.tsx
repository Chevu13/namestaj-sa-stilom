'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FolderOpen, ShoppingBag, BarChart3, PlusCircle, ExternalLink, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/admin',            label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/admin/orders',     label: 'Porudžbine',      icon: ShoppingBag },
  { href: '/admin/orders/new', label: 'Nova porudžbina', icon: PlusCircle },
  { href: '/admin/products',   label: 'Proizvodi',       icon: Package },
  { href: '/admin/categories', label: 'Kategorije',      icon: FolderOpen },
  { href: '/admin/analytics',  label: 'Analitika',       icon: BarChart3 },
]

function NavLinks({ onClose }: { onClose?: () => void }) {
  const path = usePathname()
  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? path === '/admin' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={"flex items-center gap-3 px-3 py-3 text-sm rounded transition-colors " + (active ? 'bg-white/10 text-cream-100' : 'text-cream-400 hover:bg-white/5 hover:text-cream-200')}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <Link href="/shop" target="_blank" onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-cream-500 hover:text-cream-200 transition-colors">
          <ExternalLink size={16} />
          Pogledaj sajt
        </Link>
      </div>
    </>
  )
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ── DESKTOP sidebar ── */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#1a1814] hidden lg:flex flex-col z-40">
        <div className="px-6 py-5 border-b border-white/10">
          <p style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-cream-100 text-xl font-light">Nameštaj sa Stilom</p>
          <p className="text-[10px] tracking-[2px] uppercase text-cream-500 mt-0.5">Admin panel</p>
        </div>
        <NavLinks />
      </aside>

      {/* ── MOBILE top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1814] flex items-center justify-between px-4 h-14 shadow-md">
        <div>
          <p style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-cream-100 text-lg font-light leading-none">Nameštaj sa Stilom</p>
          <p className="text-[8px] tracking-[2px] uppercase text-cream-500">Admin panel</p>
        </div>
        <button onClick={() => setOpen(true)} className="text-cream-200 p-1">
          <Menu size={22} />
        </button>
      </div>

      {/* ── MOBILE drawer ── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          {/* Panel */}
          <div className="relative w-72 bg-[#1a1814] flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <p style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-cream-100 text-xl font-light">Nameštaj sa Stilom</p>
                <p className="text-[10px] tracking-[2px] uppercase text-cream-500 mt-0.5">Admin panel</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-cream-400 hover:text-cream-100">
                <X size={20} />
              </button>
            </div>
            <NavLinks onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
