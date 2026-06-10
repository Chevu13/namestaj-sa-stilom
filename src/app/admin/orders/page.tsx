'use client'
import React, { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import { Order } from '@/types'
import Link from 'next/link'
import { Eye, ChevronDown } from 'lucide-react'

const statusColors: Record<string, string> = {
  nova:'bg-blue-100 text-blue-800', u_obradi:'bg-yellow-100 text-yellow-800',
  poslato:'bg-purple-100 text-purple-800', isporuceno:'bg-green-100 text-green-800', otkazano:'bg-red-100 text-red-800',
}
const statusLabels: Record<string,string> = { nova:'Nova',u_obradi:'U obradi',poslato:'Poslato',isporuceno:'Isporučeno',otkazano:'Otkazano' }
const sourceLabels: Record<string,string> = { website:'Website',instagram:'Instagram',telefon:'Telefon',salon:'Salon' }
const STATUSES = ['nova','u_obradi','poslato','isporuceno','otkazano']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [expandedId, setExpandedId] = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/orders').then(r=>r.json()).then(data=>{ setOrders(Array.isArray(data)?data:[]); setLoading(false) })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/orders', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id, status}) })
    setOrders(orders.map(o => o.id === id ? {...o, status: status as any} : o))
  }

  const filtered = filterStatus ? orders.filter(o => o.status === filterStatus) : orders

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Porudžbine</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} ukupno</p>
        </div>
        <Link href="/admin/orders/new" className="bg-[#1a1814] text-white px-4 py-2 text-sm rounded hover:bg-[#3d382e] transition-colors">
          + Nova porudžbina
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterStatus('')} className={"px-3 py-1.5 text-xs rounded border transition-colors " + (!filterStatus?'bg-gray-900 text-white border-gray-900':'border-gray-200 text-gray-600 hover:border-gray-400')}>
          Sve ({orders.length})
        </button>
        {STATUSES.map(s => {
          const cnt = orders.filter(o=>o.status===s).length
          return (
            <button key={s} onClick={() => setFilterStatus(s)} className={"px-3 py-1.5 text-xs rounded border transition-colors " + (filterStatus===s?'bg-gray-900 text-white border-gray-900':'border-gray-200 text-gray-600 hover:border-gray-400')}>
              {statusLabels[s]} ({cnt})
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Učitavanje...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">Nema porudžbina</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium">Broj</th>
                  <th className="text-left px-5 py-3 font-medium">Kupac</th>
                  <th className="text-left px-5 py-3 font-medium">Telefon</th>
                  <th className="text-left px-5 py-3 font-medium">Datum</th>
                  <th className="text-left px-5 py-3 font-medium">Iznos</th>
                  <th className="text-left px-5 py-3 font-medium">Izvor</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3"/>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-mono font-semibold text-gray-900">{order.order_number}</td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                          <p className="text-xs text-gray-400">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">{order.customer_phone}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('sr-RS')}</td>
                      <td className="px-5 py-3 text-sm font-semibold">{formatPrice(order.total_amount)}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{sourceLabels[order.source]||order.source}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={e => updateStatus(order.id, e.target.value)}
                            className={"text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer appearance-none pr-6 " + (statusColors[order.status]||'bg-gray-100 text-gray-700')}
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => setExpandedId(expandedId===order.id?null:order.id)} className="text-gray-400 hover:text-gray-700">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={order.id+'-detail'} className="bg-gray-50">
                        <td colSpan={8} className="px-5 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                              <p className="font-medium text-gray-700 mb-2">Adresa isporuke</p>
                              <p className="text-gray-600">{order.address}, {order.city} {order.postal_code}</p>
                              {order.notes && <p className="text-gray-500 mt-1 italic">"{order.notes}"</p>}
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 mb-2">Stavke porudžbine</p>
                              <div className="space-y-1">
                                {(order.items||[]).map((item: any) => (
                                  <div key={item.id} className="flex justify-between text-gray-600">
                                    <span>{item.product_name} x{item.quantity}</span>
                                    <span className="font-medium">{formatPrice(item.product_price*item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold">
                                <span>Ukupno</span>
                                <span>{formatPrice(order.total_amount)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
