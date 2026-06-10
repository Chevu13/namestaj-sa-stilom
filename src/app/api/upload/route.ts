import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function ensureBucket() {
  // Try to get bucket first
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.find(b => b.id === 'product-images')
  if (!exists) {
    await supabase.storage.createBucket('product-images', { public: true })
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nema fajla' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Samo slike (JPG, PNG, WebP)' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Maksimalna veličina je 10 MB' }, { status: 400 })
    }

    // Ensure bucket exists
    await ensureBucket()

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Storage upload error:', error)
      // Fallback: return base64 data URL so the image still works
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const dataUrl = `data:${file.type};base64,${base64}`
      return NextResponse.json({ url: dataUrl, fallback: true })
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: urlData.publicUrl })

  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Upload nije uspeo' }, { status: 500 })
  }
}
