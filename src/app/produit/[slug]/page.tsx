export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { db } from '@/lib/db'
import ProductGallery from '@/components/product/ProductGallery'
import AddToCartForm from '@/components/product/AddToCartForm'
import ProductCard from '@/components/catalog/ProductCard'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await db.products.findBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} — Éclat Paris`,
    description: product.tagline ?? product.description ?? '',
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await db.products.findBySlug(slug)
  if (!product) notFound()

  const related = await db.products.findMany({
    categorySlug: product.categories?.slug,
  }).then((ps) => ps.filter((p) => p.id !== product.id).slice(0, 4))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-xs text-stone-400 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-stone-700">Accueil</Link>
        <span>›</span>
        <Link href="/catalogue" className="hover:text-stone-700">Catalogue</Link>
        <span>›</span>
        <span className="text-stone-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-3">
            {product.skin_types.join(' · ')}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">{product.name}</h1>
          {product.tagline && (
            <p className="text-stone-500 text-sm mb-4">{product.tagline}</p>
          )}

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  className={
                    s <= Math.round(product.rating)
                      ? 'fill-stone-800 text-stone-800'
                      : 'fill-stone-200 text-stone-200'
                  }
                />
              ))}
            </div>
            <span className="text-sm text-stone-500">{product.rating} ({product.review_count} avis)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-2xl font-medium text-stone-900">{product.price.toFixed(2)} €</span>
            {product.compare_price && (
              <span className="text-stone-400 line-through text-sm">
                {product.compare_price.toFixed(2)} €
              </span>
            )}
          </div>

          <AddToCartForm product={product} />

          <div className="mt-10 space-y-0 border-t border-stone-100">
            {product.description && (
              <details className="group border-b border-stone-100">
                <summary className="flex justify-between items-center py-4 text-sm font-medium text-stone-900 cursor-pointer list-none">
                  Description
                  <span className="text-stone-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-stone-600 pb-4 leading-relaxed">{product.description}</p>
              </details>
            )}
            {product.ingredients && (
              <details className="group border-b border-stone-100">
                <summary className="flex justify-between items-center py-4 text-sm font-medium text-stone-900 cursor-pointer list-none">
                  Ingrédients (INCI)
                  <span className="text-stone-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-xs text-stone-500 pb-4 leading-relaxed">{product.ingredients}</p>
              </details>
            )}
            <details className="group border-b border-stone-100">
              <summary className="flex justify-between items-center py-4 text-sm font-medium text-stone-900 cursor-pointer list-none">
                Livraison & retours
                <span className="text-stone-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="text-sm text-stone-600 pb-4 space-y-1">
                <p>Livraison standard : 3–5 jours ouvrés (offerte dès 49€)</p>
                <p>Livraison express : 1–2 jours ouvrés</p>
                <p>Retours gratuits sous 30 jours</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-3xl text-stone-900 mb-8 text-center">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
