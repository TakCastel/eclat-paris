'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Plus } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCartStore } from '@/lib/cart-store'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore()

  return (
    <div className="group">
      <Link href={`/produit/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden mb-3">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-stone-100" />
          )}
          {product.compare_price && (
            <span className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] tracking-wider px-2 py-1 uppercase">
              Promo
            </span>
          )}
        </div>
        <p className="text-xs text-stone-400 tracking-wider uppercase mb-1">
          {product.skin_types.slice(0, 2).join(' · ')}
        </p>
        <h3 className="text-sm font-medium text-stone-900 mb-1 line-clamp-2">{product.name}</h3>
        {product.tagline && (
          <p className="text-xs text-stone-500 mb-2 line-clamp-1">{product.tagline}</p>
        )}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={
                  s <= Math.round(product.rating)
                    ? 'fill-stone-800 text-stone-800'
                    : 'fill-stone-200 text-stone-200'
                }
              />
            ))}
          </div>
          <span className="text-xs text-stone-400">({product.review_count})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-900">
            {product.price.toFixed(2)} €
          </span>
          {product.compare_price && (
            <span className="text-xs text-stone-400 line-through">
              {product.compare_price.toFixed(2)} €
            </span>
          )}
        </div>
      </Link>
      <button
        onClick={() => addItem(product, product.sizes[0] ?? null)}
        className="mt-3 w-full flex items-center justify-center gap-2 border border-stone-200 text-stone-700 text-xs py-2.5 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
      >
        <Plus size={12} />
        Ajouter au panier
      </button>
    </div>
  )
}
