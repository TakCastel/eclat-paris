export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { db } from '@/lib/db'
import { Product } from '@/lib/types'
import ProductCard from '@/components/catalog/ProductCard'
import CatalogFilters from '@/components/catalog/CatalogFilters'

interface PageProps {
  searchParams: Promise<{
    categorie?: string
    peau?: string
    prix?: string
    tri?: string
  }>
}

async function getProducts(params: Awaited<PageProps['searchParams']>): Promise<Product[]> {
  return db.products.findMany({
    categorySlug: params.categorie,
    skinType: params.peau,
    orderBy: params.tri,
    ...(params.prix ? {
      minPrice: Number(params.prix.split('-')[0]),
      maxPrice: Number(params.prix.split('-')[1]),
    } : {}),
  })
}

async function CatalogGrid({ params }: { params: Awaited<PageProps['searchParams']> }) {
  const products = await getProducts(params)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-stone-500">
          {products.length} produit{products.length !== 1 ? 's' : ''}
        </p>
        <SortSelect value={params.tri ?? ''} />
      </div>

      {products.length === 0 ? (
        <div className="col-span-full py-20 text-center text-stone-400 text-sm">
          Aucun produit ne correspond à vos critères.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  )
}

function SortSelect({ value }: { value: string }) {
  return (
    <select
      defaultValue={value}
      className="text-sm border border-stone-200 px-3 py-2 text-stone-700 bg-white focus:outline-none"
    >
      <option value="">Tri par défaut</option>
      <option value="price_asc">Prix croissant</option>
      <option value="price_desc">Prix décroissant</option>
      <option value="rating">Mieux notés</option>
    </select>
  )
}

export default async function CataloguePage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-xs text-stone-400 mb-6">
        <span>Accueil</span> <span className="mx-2">›</span>
        <span className="text-stone-700">Catalogue</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-4xl text-stone-900">Catalogue</h1>
        <p className="text-stone-500 mt-2 text-sm">Des soins efficaces, sains et sensoriels</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <Suspense fallback={<div className="w-56 h-64 bg-stone-50 animate-pulse rounded" />}>
          <CatalogFilters />
        </Suspense>

        <div className="flex-1">
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-stone-100 animate-pulse rounded" />
                ))}
              </div>
            }
          >
            <CatalogGrid params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
