import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), images:product_images(*)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { images, category, ...productData } = body  // strip joined objects

  const slug = (productData.name || 'proizvod')
    .toLowerCase()
    .replace(/[čć]/g, 'c').replace(/[šđ]/g, 's').replace(/ž/g, 'z')
    .replace(/[^a-z0-9\s]/gi, '')
    .replace(/\s+/g, '-')
    .trim() + '-' + Date.now()

  const { data: product, error } = await supabase
    .from('products')
    .insert({ ...productData, slug })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (images && images.length > 0) {
    await supabase.from('product_images').insert(
      images.map((img: any, i: number) => ({ url: img.url, alt: img.alt || '', product_id: product.id, sort_order: i }))
    )
  }

  return NextResponse.json(product)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  // Strip everything that's not a real column — joined objects, virtual fields
  const { id, images, category, created_at, updated_at, ...rest } = body

  const updates = {
    name:         rest.name,
    description:  rest.description,
    price:        Number(rest.price),
    category_id:  rest.category_id || null,
    material:     rest.material || null,
    dimensions:   rest.dimensions || null,
    color:        rest.color || null,
    availability: rest.availability,
    featured:     Boolean(rest.featured),
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Replace images
  if (images !== undefined) {
    await supabase.from('product_images').delete().eq('product_id', id)
    const validImgs = images.filter((img: any) => img.url && img.url.trim())
    if (validImgs.length > 0) {
      await supabase.from('product_images').insert(
        validImgs.map((img: any, i: number) => ({ url: img.url, alt: img.alt || '', product_id: id, sort_order: i }))
      )
    }
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
