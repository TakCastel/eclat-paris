'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import CartDrawer from './CartDrawer'

const navLinks = [
  { label: 'Soins visage', href: '/catalogue?categorie=soins-visage' },
  { label: 'Maquillage', href: '/catalogue?categorie=maquillage' },
  { label: 'Corps', href: '/catalogue?categorie=corps' },
  { label: 'Coffrets', href: '/catalogue?categorie=coffrets' },
  { label: 'Nos engagements', href: '/engagements' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount, openCart } = useCartStore()
  const count = itemCount()

  return (
    <>
      <div className="bg-stone-100 text-center text-xs py-2 text-stone-600 tracking-wide">
        Livraison offerte dès 49€ d'achat · Fabriqué en France · Retours gratuits
      </div>
      <header className="sticky top-0 z-40 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Nav gauche */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-stone-700 w-1/3">
            {navLinks.slice(0, 2).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-stone-900 tracking-wide transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Logo centré */}
          <Link href="/" className="flex-1 md:flex-none text-center">
            <span className="font-serif text-2xl tracking-[0.25em] text-stone-900 uppercase">
              Éclat
            </span>
            <span className="block text-[9px] tracking-[0.4em] text-stone-500 uppercase -mt-1">
              Paris
            </span>
          </Link>

          {/* Nav droite + icônes */}
          <div className="flex items-center gap-6 w-1/3 justify-end">
            <nav className="hidden md:flex items-center gap-8 text-sm text-stone-700">
              {navLinks.slice(2, 5).map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-stone-900 tracking-wide transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <button className="text-stone-600 hover:text-stone-900 transition-colors">
                <Search size={18} />
              </button>
              <button className="text-stone-600 hover:text-stone-900 transition-colors">
                <User size={18} />
              </button>
              <button
                onClick={openCart}
                className="relative text-stone-600 hover:text-stone-900 transition-colors"
              >
                <ShoppingBag size={18} />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
              <button
                className="md:hidden text-stone-600"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white px-4 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-stone-700 hover:text-stone-900 py-1"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  )
}
