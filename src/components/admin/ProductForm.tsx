'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, Upload } from 'lucide-react'
import { Product, Category } from '@/lib/types'

interface Props {
  product?: Product
  categories: Category[]
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [tagline, setTagline] = useState(product?.tagline ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [ingredients, setIngredients] = useState(product?.ingredients ?? '')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [comparePrice, setComparePrice] = useState(product?.compare_price?.toString() ?? '')
  const [stock, setStock] = useState(product?.stock?.toString() ?? '100')
  const [sizes, setSizes] = useState(product?.sizes?.join(', ') ?? '')
  const [skinTypes, setSkinTypes] = useState(product?.skin_types?.join(', ') ?? '')
  const [isBestseller, setIsBestseller] = useState(product?.is_bestseller ?? false)
  const [existingImages, setExistingImages] = useState<string[]>(product?.images ?? [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [slugManual, setSlugManual] = useState(!!product)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNameChange = useCallback((value: string) => {
    setName(value)
    if (!slugManual) setSlug(slugify(value))
  }, [slugManual])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setNewFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setNewPreviews((prev) => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function removeExisting(idx: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function removeNew(idx: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx))
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const uploadedUrls: string[] = []
      for (const file of newFiles) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error ?? `Erreur upload (${res.status})`)
        }
        const { url } = await res.json()
        uploadedUrls.push(url)
      }

      const body = {
        name,
        slug,
        tagline: tagline || null,
        description: description || null,
        ingredients: ingredients || null,
        category_id: categoryId || null,
        price: parseFloat(price),
        compare_price: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock, 10),
        sizes: sizes.split(',').map((s) => s.trim()).filter(Boolean),
        skin_types: skinTypes.split(',').map((s) => s.trim()).filter(Boolean),
        is_bestseller: isBestseller,
        images: [...existingImages, ...uploadedUrls],
      }

      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Erreur serveur (${res.status})`)
      }

      router.push('/admin/produits')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Infos principales */}
      <section className="bg-white border border-stone-200 p-6 space-y-5">
        <h2 className="text-sm font-medium text-stone-900 uppercase tracking-wider">Informations</h2>

        <Field label="Nom *">
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className={inputCls}
          />
        </Field>

        <Field label="Slug *">
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
            required
            className={inputCls}
          />
        </Field>

        <Field label="Accroche">
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={inputCls}
          />
        </Field>

        <Field label="Ingrédients (INCI)">
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={3}
            className={inputCls}
          />
        </Field>

        <Field label="Catégorie">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputCls}
          >
            <option value="">— Sans catégorie —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
      </section>

      {/* Prix & stock */}
      <section className="bg-white border border-stone-200 p-6 space-y-5">
        <h2 className="text-sm font-medium text-stone-900 uppercase tracking-wider">Prix & stock</h2>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Prix (€) *">
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Prix barré (€)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Stock">
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="Contenances (séparées par des virgules)">
          <input
            type="text"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="30 ml, 50 ml"
            className={inputCls}
          />
        </Field>

        <Field label="Types de peau (séparées par des virgules)">
          <input
            type="text"
            value={skinTypes}
            onChange={(e) => setSkinTypes(e.target.value)}
            placeholder="Peau mixte, Peau grasse"
            className={inputCls}
          />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isBestseller}
            onChange={(e) => setIsBestseller(e.target.checked)}
            className="w-4 h-4 accent-stone-900"
          />
          <span className="text-sm text-stone-700">Bestseller</span>
        </label>
      </section>

      {/* Images */}
      <section className="bg-white border border-stone-200 p-6 space-y-4">
        <h2 className="text-sm font-medium text-stone-900 uppercase tracking-wider">Images</h2>

        <div className="flex flex-wrap gap-3">
          {existingImages.map((url, i) => (
            <div key={url} className="relative w-24 h-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(i)}
                className="absolute -top-1.5 -right-1.5 bg-white border border-stone-200 rounded-full p-0.5 hover:bg-red-50"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {newPreviews.map((src, i) => (
            <div key={i} className="relative w-24 h-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover opacity-70" />
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute -top-1.5 -right-1.5 bg-white border border-stone-200 rounded-full p-0.5 hover:bg-red-50"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-stone-200 hover:border-stone-400 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-stone-600"
          >
            <Upload size={18} />
            <span className="text-xs">Ajouter</span>
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-stone-900 text-white text-sm px-6 py-2.5 hover:bg-stone-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-stone-400 hover:text-stone-700"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}

const inputCls =
  'w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-400 bg-white'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
