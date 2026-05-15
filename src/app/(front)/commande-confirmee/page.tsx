'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

export default function CommandeConfirmeePage() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <CheckCircle className="mx-auto mb-6 text-green-500" size={56} />
      <h1 className="font-serif text-3xl text-stone-900 mb-4">Commande confirmée !</h1>
      <p className="text-stone-500 text-sm leading-relaxed mb-8">
        Merci pour votre commande. Vous recevrez un e-mail de confirmation sous peu.
        Votre colis sera expédié dans les 2 à 3 jours ouvrés.
      </p>
      <Link
        href="/catalogue"
        className="inline-block bg-stone-900 text-white text-sm tracking-wide px-8 py-4 hover:bg-stone-700 transition-colors"
      >
        Continuer mes achats
      </Link>
    </div>
  )
}
