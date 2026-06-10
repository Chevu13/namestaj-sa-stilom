import { getProduct, getProducts } from '@/lib/data'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map(p => ({ slug: p.slug }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}
