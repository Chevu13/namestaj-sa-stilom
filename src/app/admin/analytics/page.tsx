import { getDashboardStats, getProducts } from '@/lib/data'
import AnalyticsClient from './AnalyticsClient'

export const revalidate = 60

export default async function AnalyticsPage() {
  const [stats, products] = await Promise.all([ getDashboardStats(), getProducts() ])
  return <AnalyticsClient stats={stats} products={products} />
}
