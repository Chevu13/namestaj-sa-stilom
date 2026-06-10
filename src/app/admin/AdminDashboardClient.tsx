'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ShoppingBag, TrendingUp, Calendar, DollarSign, Package } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Order } from '@/types'

const statusColors: Record<string, string> = {
  nova: 'bg-blue-100 text-blue-800',
  u_obradi: 'bg-yellow-100 text-yellow-800',
  poslato: 'bg-purple-100 text-purple-800',
  isporuceno: 'bg-green-100 text-green-800',
  otkazano: 'bg-red-100 text-red-800',
}
const statusLabels: Record<string, string> = {
  nova: 'Nova', u_obradi: 'U obradi', poslato: 'Poslato', isporuceno: 'Isporučeno', otkazano: 'Otkazano',
}
const sourceLabels: Record<string, string> = {
  website: 'Website', instagram: 'Instagram', telefon: 'Telefon', salon: 'Salon',
}
const PIE_COLORS = ['#1a1814', '#c08040', '#d4a96a', '#e8d0a8', '#524d41']
const monthNames: Record<string, string> = {
  '01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'Maj','06':'Jun',
  '07':'Jul','08':'Avg','09':'Sep','10':'Okt','11':'Nov','12':'Dec',
}

interface Props { stats: any; orders: Order[] }

export default function AdminDashboardClient({ stats, orders }: Props) {
  const revenueData = stats.revenueByMonth.map((r: any) => ({
    ...r,
    name: monthNames[r.month] || r.month,
  }))
  const sourceData = stats.ordersBySource.map((s: any) => ({
    name: sourceLabels[s.source] || s.source,
    value: s.count,
  }))

  const kpis = [
    { label: 'Ukupne porudžbine', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ukupan prihod', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Danas', value: stats.ordersToday, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Ovaj mesec', value: stats.ordersThisMonth, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Prosečna vrednost', value: formatPrice(stats.averageOrderValue), icon: Package, color: 'text-pink-600', bg: 'bg-pink-50' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Pregled poslovanja u realnom vremenu</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
              <kpi.icon size={18} className={kpi.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">Prihod po mesecima (RSD)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v/1000)+'k'} />
              <Tooltip formatter={(v: any) => formatPrice(v)} />
              <Bar dataKey="revenue" fill="#1a1814" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">Porudžbine po izvoru</h2>
          {sourceData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {sourceData.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {sourceData.map((s: any, i: number) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-gray-600">{s.name}</span>
                    </div>
                    <span className="font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Nema podataka</div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">Poslednje porudžbine</h2>
          <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline">Sve porudžbine →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left px-6 py-3 font-medium">Broj</th>
                <th className="text-left px-6 py-3 font-medium">Kupac</th>
                <th className="text-left px-6 py-3 font-medium">Datum</th>
                <th className="text-left px-6 py-3 font-medium">Iznos</th>
                <th className="text-left px-6 py-3 font-medium">Izvor</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-mono font-medium text-gray-900">{order.order_number}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{order.customer_name}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('sr-RS')}</td>
                  <td className="px-6 py-3 text-sm font-medium">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-3 text-xs"><span className="px-2 py-1 bg-gray-100 rounded">{sourceLabels[order.source]}</span></td>
                  <td className="px-6 py-3">
                    <span className={"text-xs px-2 py-1 rounded-full font-medium " + (statusColors[order.status] || 'bg-gray-100 text-gray-700')}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">Nema porudžbina</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
