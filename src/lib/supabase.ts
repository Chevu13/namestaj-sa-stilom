import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          price: number
          category_id: string
          material: string | null
          dimensions: string | null
          color: string | null
          availability: 'in_stock' | 'out_of_stock' | 'on_order'
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>
      }
      orders: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_price: number
          quantity: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
    }
  }
}
