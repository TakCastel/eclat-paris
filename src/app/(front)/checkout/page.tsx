'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import Image from 'next/image'
import { CheckoutFormData } from '@/lib/types'

const SHIPPING_METHODS = [
  { id: 'standard', label: 'Livraison standard', desc: '3–5 jours ouvrés', price: 0, free_above: 49 },
  { id: 'express', label: 'Livraison express', desc: '1–2 jours ouvrés', price: 8.9 },
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const cartTotal = total()

  const [form, setForm] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    shippingMethod: 'standard',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 text-sm">Votre panier est vide.</p>
      </div>
    )
  }

  const selectedShipping = SHIPPING_METHODS.find((m) => m.id === form.shippingMethod)!
  const shippingCost =
    form.shippingMethod === 'standard' && cartTotal >= 49 ? 0 : selectedShipping.price
  const orderTotal = cartTotal + shippingCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, form, shippingCost }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur lors du paiement')
      if (!data.url) throw new Error('URL de paiement manquante')
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl text-stone-900 mb-8">Paiement sécurisé</h1>

      {/* Étapes */}
      <div className="flex items-center gap-2 text-xs text-stone-400 mb-10">
        {['Panier', 'Livraison', 'Paiement', 'Confirmation'].map((step, i) => (
          <span key={step} className="flex items-center gap-2">
            <span className={i <= 1 ? 'text-stone-900 font-medium' : ''}>{step}</span>
            {i < 3 && <span>›</span>}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        {/* Formulaire */}
        <div className="space-y-8">
          {/* Adresse */}
          <section>
            <h2 className="text-sm font-medium text-stone-900 mb-4 pb-2 border-b border-stone-100">
              1. Adresse de livraison
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-stone-500 block mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                  placeholder="votre@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Prénom</label>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Nom</label>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Adresse</label>
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                  placeholder="12 rue de la Paix"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Code postal</label>
                  <input
                    required
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Ville</label>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Pays</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-400 bg-white"
                >
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Luxembourg</option>
                </select>
              </div>
            </div>
          </section>

          {/* Livraison */}
          <section>
            <h2 className="text-sm font-medium text-stone-900 mb-4 pb-2 border-b border-stone-100">
              2. Mode de livraison
            </h2>
            <div className="space-y-3">
              {SHIPPING_METHODS.map((method) => {
                const effectivePrice =
                  method.id === 'standard' && cartTotal >= 49 ? 0 : method.price
                return (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                      form.shippingMethod === method.id
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={form.shippingMethod === method.id}
                        onChange={() =>
                          setForm({ ...form, shippingMethod: method.id as 'standard' | 'express' })
                        }
                        className="accent-stone-800"
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-900">{method.label}</p>
                        <p className="text-xs text-stone-500">{method.desc}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-stone-900">
                      {effectivePrice === 0 ? 'Offert' : `${effectivePrice.toFixed(2)} €`}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-4 text-sm tracking-wide hover:bg-stone-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Redirection vers le paiement...' : `Payer ${orderTotal.toFixed(2)} €`}
          </button>

          <div className="flex items-center justify-center gap-6 text-stone-400 text-xs">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
            <span className="flex items-center gap-1">
              <span>🔒</span> Paiement 100% sécurisé
            </span>
          </div>
        </div>

        {/* Récapitulatif */}
        <aside className="bg-stone-50 p-6 h-fit sticky top-24">
          <h3 className="text-sm font-medium text-stone-900 mb-4">Récapitulatif de la commande</h3>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3">
                <div className="relative w-14 h-14 bg-white flex-shrink-0 overflow-hidden">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                  <span className="absolute -top-1.5 -right-1.5 bg-stone-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-stone-900 line-clamp-2">{item.product.name}</p>
                  {item.selectedSize && (
                    <p className="text-xs text-stone-500">{item.selectedSize}</p>
                  )}
                </div>
                <p className="text-xs font-medium text-stone-900">
                  {(item.product.price * item.quantity).toFixed(2)} €
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Sous-total</span>
              <span>{cartTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Livraison</span>
              <span>{shippingCost === 0 ? 'Offerte' : `${shippingCost.toFixed(2)} €`}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-stone-900 pt-2 border-t border-stone-200">
              <span>Total</span>
              <span>{orderTotal.toFixed(2)} €</span>
            </div>
          </div>
          {cartTotal < 49 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
              Plus que {(49 - cartTotal).toFixed(2)} € pour profiter de la livraison offerte !
            </div>
          )}
        </aside>
      </form>
    </div>
  )
}
