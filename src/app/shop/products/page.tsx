import ProductsClient from './ProductsClient'
import { getProducts, getCategories } from '@/lib/data'

export const revalidate = 60

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>
}) {
  const { category } = await searchParams
  const [products, allProducts, categories] = await Promise.all([
    getProducts(category),   // filtrirani za prikaz
    getProducts(),           // SVI za brojanje u filterima
    getCategories(),
  ])
  return <ProductsClient products={products} allProducts={allProducts} categories={categories} activeCategorySlug={category} />
}
