'use client'
import { useState, useEffect } from 'react'
import { Category } from '@/types'
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<string|null>(null)
  const [form, setForm] = useState({ name:'', description:'', image_url:'' })
  const [saving, setSaving] = useState(false)

  const load = () => fetch('/api/categories').then(r=>r.json()).then(d=>setCategories(Array.isArray(d)?d:[]))
  useEffect(()=>{ load() },[])

  const save = async () => {
    setSaving(true)
    await fetch('/api/categories', {
      method: editing==='new'?'POST':'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(editing==='new' ? form : {...form, id:editing})
    })
    setEditing(null)
    setSaving(false)
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Obrisati ovu kategoriju?')) return
    await fetch('/api/categories', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id}) })
    load()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Kategorije</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} kategorija</p>
        </div>
        <button onClick={()=>{ setForm({name:'',description:'',image_url:''}); setEditing('new') }} className="flex items-center gap-2 bg-[#1a1814] text-white px-4 py-2 text-sm rounded hover:bg-[#3d382e]">
          <Plus size={16}/> Nova kategorija
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-700">{editing==='new'?'Nova kategorija':'Uredi kategoriju'}</h2>
            <button onClick={()=>setEditing(null)}><X size={18} className="text-gray-400"/></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Naziv *</label>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Opis</label>
              <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">URL slike (za homepage)</label>
              <input value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400" placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 text-sm rounded hover:bg-green-600 disabled:opacity-60">
              <Check size={14}/> {saving?'Snima...':'Sačuvaj'}
            </button>
            <button onClick={()=>setEditing(null)} className="border border-gray-200 px-4 py-2 text-sm rounded hover:bg-gray-50">Otkaži</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
              <p className="text-xs text-blue-400 font-mono mt-0.5">/{cat.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>{ setForm({name:cat.name,description:cat.description||'',image_url:cat.image_url||''}); setEditing(cat.id) }} className="text-gray-400 hover:text-blue-600">
                <Pencil size={15}/>
              </button>
              <button onClick={()=>del(cat.id)} className="text-gray-400 hover:text-red-600">
                <Trash2 size={15}/>
              </button>
            </div>
          </div>
        ))}
        {categories.length===0 && <div className="px-5 py-10 text-center text-sm text-gray-400">Nema kategorija</div>}
      </div>
    </div>
  )
}
