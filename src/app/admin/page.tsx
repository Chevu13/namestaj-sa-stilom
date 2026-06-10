import { getDashboardStats, getOrders } from '@/lib/data'
import AdminDashboardClient from './AdminDashboardClient'

export const revalidate = 30

export default async function AdminDashboardPage() {
  const [stats, orders] = await Promise.all([
    getDashboardStats(),
    getOrders(),
  ])
  return <AdminDashboardClient stats={stats} orders={orders} />
}
