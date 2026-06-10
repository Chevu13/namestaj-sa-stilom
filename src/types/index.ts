export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt: string | null
  sort_order: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category_id: string
  category?: Category
  material: string | null
  dimensions: string | null
  color: string | null
  availability: 'in_stock' | 'out_of_stock' | 'on_order'
  featured: boolean
  images?: ProductImage[]
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  city: string
  postal_code: string
  notes: string | null
  total_amount: number
  delivery_cost: number
  status: 'nova' | 'u_obradi' | 'poslato' | 'isporuceno' | 'otkazano'
  source: 'website' | 'instagram' | 'telefon' | 'salon'
  items?: OrderItem[]
  created_at: string
  updated_at: string
}

export interface CheckoutFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  city: string
  postal_code: string
  notes: string
}
