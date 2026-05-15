'use client'

import { useState } from 'react'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCartStore } from '@/lib/cart-store'

interface Props {
  product: Product
}

export default function AddToCartForm({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length > 0 ? product.sizes[0] : null
  )
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()

  const handleAdd = () => {
    addItem(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-6">
      {product.sizes.length > 1 && (
        <div>
          <p className="text-xs text-stone-500 mb-3 tracking-wide uppercase">Contenance</p>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  selectedSize === s
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className="flex-1 flex items-center justify-center gap-2 bg-stone-900 text-white py-4 text-sm tracking-wide hover:bg-stone-700 transition-colors"
        >
          {added ? (
            <>
              <Check size={16} />
              Ajouté au panier
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Ajouter au panier
            </>
          )}
        </button>
        <button className="border border-stone-200 px-4 py-4 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      <div className="space-y-2 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          <span>Livraison offerte dès 49€ d'achat</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 flex-shrink-0" />
          <span>Paiement sécurisé</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 flex-shrink-0" />
          <span>Retours gratuits sous 30 jours</span>
        </div>
      </div>
    </div>
  )
}
