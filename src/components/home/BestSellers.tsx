import { db } from '@/lib/db'
import ProductCard from '@/components/catalog/ProductCard'
import Link from 'next/link'

export default async function BestSellers() {
  const products = await db.products.findMany({ bestseller: true })
  const visible = products.slice(0, 4)

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-3">Nos best-sellers</p>
        <h2 className="font-serif text-4xl text-stone-900">Les favoris de nos clientes</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/catalogue"
          className="inline-block border border-stone-900 text-stone-900 text-sm tracking-widest uppercase px-8 py-4 hover:bg-stone-900 hover:text-white transition-colors"
        >
          Voir tous les produits
        </Link>
      </div>
    </section>
  )
}
