import { supabase } from './supabase'
import { Category, Product, Order } from '@/types'

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`*, category:categories(*), images:product_images(*)`)
    .order('created_at', { ascending: false })

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data, error } = await query
  if (error) { console.error(error); return [] }
  return (data || []).map((p: any) => ({
    ...p,
    images: (p.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
  }))
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories(*), images:product_images(*)`)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(4)
  if (error) { console.error(error); return [] }
  return (data || []).map((p: any) => ({
    ...p,
    images: (p.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
  }))
}

export async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories(*), images:product_images(*)`)
    .eq('slug', slug)
    .single()
  if (error) { console.error(error); return null }
  if (!data) return null
  return {
    ...data,
    images: (data.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
  }
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, items:order_items(*)`)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getOrder(orderNumber: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, items:order_items(*)`)
    .eq('order_number', orderNumber)
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function getDashboardStats() {
  const [ordersRes, itemsRes] = await Promise.all([
    supabase.from('orders').select('*'),
    supabase.from('order_items').select('*, product:products(category_id, category:categories(name))'),
  ])

  const orders = ordersRes.data || []
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0)
  const ordersToday = orders.filter((o: any) => o.created_at.startsWith(today)).length
  const ordersThisMonth = orders.filter((o: any) => o.created_at.startsWith(thisMonth)).length

  // Revenue by month (last 6 months)
  const revenueByMonth: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    revenueByMonth[key] = 0
  }
  orders.forEach((o: any) => {
    const month = o.created_at.slice(0, 7)
    if (revenueByMonth[month] !== undefined) {
      revenueByMonth[month] += Number(o.total_amount)
    }
  })

  // Orders by source
  const bySource: Record<string, number> = {}
  orders.forEach((o: any) => {
    bySource[o.source] = (bySource[o.source] || 0) + 1
  })

  return {
    totalOrders: orders.length,
    totalRevenue,
    ordersToday,
    ordersThisMonth,
    averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
    revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month: month.slice(5),
      revenue,
    })),
    ordersBySource: Object.entries(bySource).map(([source, count]) => ({ source, count })),
    recentOrders: orders.slice(0, 10),
  }
}
