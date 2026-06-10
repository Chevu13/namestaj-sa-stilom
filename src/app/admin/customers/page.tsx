'use client'
import { useState, useEffect } from 'react'
import { Order } from '@/types'
import { formatPrice } from '@/lib/utils'

interface Customer {
  name: string
  email: string
  phone: string
  orders: Order[]
  totalSpent: number
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/orders').then(r=>r.json()).then((orders: Order[]) => {
      if (!Array.isArray(orders)) { setLoading(false); return }
      const map: Record<string, Customer> = {}
      orders.forEach(o => {
        const key = o.customer_email
        if (!map[key]) map[key] = { name:o.customer_name, email:o.customer_email, phone:o.customer_phone, orders:[], totalSpent:0 }
        map[key].orders.push(o)
        map[key].totalSpent += Number(o.total_amount)
      })
      setCustomers(Object.values(map).sort((a,b) => b.totalSpent-a.totalSpent))
      setLoading(false)
    })
  }, [])

  const selectedCustomer = customers.find(c => c.email === selected)
  const statusColors: Record<string,string> = { nova:'bg-blue-100 text-blue-800',u_obradi:'bg-yellow-100 text-yellow-800',poslato:'bg-purple-100 text-purple-800',isporuceno:'bg-green-100 text-green-800',otkazano:'bg-red-100 text-red-800' }
  const statusLabels: Record<string,string> = { nova:'Nova',u_obradi:'U obradi',poslato:'Poslato',isporuceno:'Isporučeno',otkazano:'Otkazano' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Kupci</h1>
        <p className="text-sm text-gray-500 mt-1">{customers.length} kupaca</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer list */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-100">
          {loading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Učitavanje...</div>
          ) : customers.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">Nema kupaca</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {customers.map(c => (
                <button
                  key={c.email}
                  onClick={() => setSelected(c.email === selected ? null : c.email)}
                  className={"w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors " + (selected===c.email?'bg-blue-50':'')}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-900">{formatPrice(c.totalSpent)}</p>
                      <p className="text-xs text-gray-400">{c.orders.length} {c.orders.length===1?'porudžbina':'porudžbina'}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Customer detail */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">{selectedCustomer.name}</h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>{selectedCustomer.email}</span>
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Ukupno potrošeno</p>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(selectedCustomer.totalSpent)}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-500">Broj porudžbina</p>
                    <p className="text-lg font-bold text-gray-900">{selectedCustomer.orders.length}</p>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Istorija porudžbina</h3>
              <div className="space-y-2">
                {selectedCustomer.orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm">
                    <div>
                      <p className="font-mono font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('sr-RS')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                      <span className={"text-xs px-2 py-0.5 rounded-full " + (statusColors[order.status]||'bg-gray-100 text-gray-600')}>
                        {statusLabels[order.status]||order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-64">
              <p className="text-gray-400 text-sm">Izaberite kupca za detalje</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
