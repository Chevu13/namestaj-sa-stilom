'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'

const monthNames: Record<string,string> = {
  '01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'Maj','06':'Jun',
  '07':'Jul','08':'Avg','09':'Sep','10':'Okt','11':'Nov','12':'Dec',
}
const sourceLabels: Record<string,string> = { website:'Website',instagram:'Instagram',telefon:'Telefon',salon:'Salon' }
const COLORS = ['#1a1814','#c08040','#d4a96a','#e8d0a8','#524d41']

export default function AnalyticsClient({ stats, products }: { stats: any, products: Product[] }) {
  const revenueData = stats.revenueByMonth.map((r: any) => ({ name: monthNames[r.month]||r.month, Prihod: r.revenue }))
  const sourceData = stats.ordersBySource.map((s: any) => ({ name: sourceLabels[s.source]||s.source, value: s.count }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analitika prodaje</h1>
        <p className="text-sm text-gray-500 mt-1">Pregled ključnih metrika poslovanja</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Ukupan prihod', value: formatPrice(stats.totalRevenue) },
          { label:'Ukupno porudžbina', value: stats.totalOrders },
          { label:'Prosečna vrednost', value: formatPrice(stats.averageOrderValue) },
          { label:'Ovaj mesec', value: stats.ordersThisMonth },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-6">Prihod po mesecima</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => (v/1000)+'k RSD'} />
            <Tooltip formatter={(v: any) => formatPrice(v)} labelClassName="font-medium" />
            <Bar dataKey="Prihod" fill="#1a1814" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source pie */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-6">Porudžbine po izvoru</h2>
          {sourceData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({name,percent}) => percent ? `${name} ${(percent*100).toFixed(0)}%` : name}>
                    {sourceData.map((_: any,i: number) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {sourceData.map((s: any, i: number) => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{background:COLORS[i%COLORS.length]}} />
                    <span className="text-gray-600">{s.name}:</span>
                    <span className="font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-52 text-gray-400 text-sm">Nema podataka</div>
          )}
        </div>

        {/* Products table */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Svi proizvodi (cene)</h2>
          <div className="space-y-2 overflow-y-auto max-h-64">
            {products.map((p,i) => (
              <div key={p.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-5">{i+1}.</span>
                  <span className="text-gray-700 truncate max-w-[180px]">{p.name}</span>
                </div>
                <span className="font-semibold text-gray-900 flex-shrink-0">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
