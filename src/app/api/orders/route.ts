import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderConfirmationEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const number = req.nextUrl.searchParams.get('number')
  if (number) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('order_number', number)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
  }
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { items, ...orderData } = body

  const order_number = generateOrderNumber()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ ...orderData, order_number })
    .select()
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message || 'Greška' }, { status: 500 })
  }

  if (items && items.length > 0) {
    await supabase.from('order_items').insert(
      items.map((item: any) => ({ ...item, order_id: order.id }))
    )
  }

  // Fetch full order with items for email
  const { data: fullOrder } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', order.id)
    .single()

  // Send email via Nodemailer (Gmail SMTP)
  if (fullOrder) {
    try {
      await sendOrderConfirmationEmail(fullOrder as any)
      console.log('Email sent for order:', order_number)
    } catch (e) {
      console.error('Email send failed:', e)
      // Ne blokiraj porudžbinu ako email padne
    }
  }

  return NextResponse.json({ order_number, id: order.id })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
