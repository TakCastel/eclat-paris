'use client'

import { X, Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart-store'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={closeCart}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
            <h2 className="font-serif text-lg tracking-wide">Mon panier</h2>
            <button onClick={closeCart} className="text-stone-500 hover:text-stone-900">
              <X size={20} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-stone-500">
              <p className="text-sm">Votre panier est vide</p>
              <Link
                href="/catalogue"
                onClick={closeCart}
                className="text-xs underline underline-offset-2 hover:text-stone-900"
              >
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4"
                  >
                    <div className="relative w-20 h-20 bg-stone-50 rounded flex-shrink-0 overflow-hidden">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">
                        {item.product.name}
                      </p>
                      {item.selectedSize && (
                        <p className="text-xs text-stone-500 mt-0.5">{item.selectedSize}</p>
                      )}
                      <p className="text-sm text-stone-700 mt-1">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)
                          }
                          className="text-stone-400 hover:text-stone-900"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)
                          }
                          className="text-stone-400 hover:text-stone-900"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedSize)}
                          className="ml-2 text-stone-300 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-5 border-t border-stone-100 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Sous-total</span>
                  <span className="font-medium">{cartTotal.toFixed(2)} €</span>
                </div>
                {cartTotal < 49 && (
                  <p className="text-xs text-stone-500">
                    Plus que {(49 - cartTotal).toFixed(2)} € pour la livraison offerte
                  </p>
                )}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-stone-900 text-white text-sm text-center py-3.5 hover:bg-stone-700 transition-colors tracking-wide"
                >
                  Passer commande
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-xs text-stone-500 underline underline-offset-2"
                >
                  Continuer mes achats
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
