'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FolderOpen, ShoppingBag, BarChart3, PlusCircle, ExternalLink } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Porudžbine', icon: ShoppingBag },
  { href: '/admin/orders/new', label: 'Nova porudžbina', icon: PlusCircle },
  { href: '/admin/products', label: 'Proizvodi', icon: Package },
  { href: '/admin/categories', label: 'Kategorije', icon: FolderOpen },
  { href: '/admin/analytics', label: 'Analitika', icon: BarChart3 },
]

export default function AdminSidebar() {
  const path = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#1a1814] hidden lg:flex flex-col z-40">
      <div className="px-6 py-5 border-b border-white/10">
        <p style={{fontFamily:'Cormorant Garamond,Georgia,serif'}} className="text-cream-100 text-xl font-light">Nameštaj sa Stilom</p>
        <p className="text-[10px] tracking-[2px] uppercase text-cream-500 mt-0.5">Admin panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? path === '/admin' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={"flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors " + (active ? 'bg-white/10 text-cream-100' : 'text-cream-400 hover:bg-white/5 hover:text-cream-200')}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <Link href="/shop" target="_blank" className="flex items-center gap-3 px-3 py-2.5 text-sm text-cream-500 hover:text-cream-200 transition-colors">
          <ExternalLink size={16} />
          Pogledaj sajt
        </Link>
      </div>
    </aside>
  )
}
