import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { db } from '@/lib/db'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function ProduitsPage() {
  const products = await db.products.findMany()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 bg-stone-900 text-white text-sm px-4 py-2 hover:bg-stone-700"
        >
          <Plus size={15} />
          Ajouter
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-stone-400 text-sm">Aucun produit pour l&apos;instant.</p>
      ) : (
        <div className="bg-white border border-stone-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left">
                <th className="px-4 py-3 font-medium text-stone-500 text-xs uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 font-medium text-stone-500 text-xs uppercase tracking-wider">Catégorie</th>
                <th className="px-4 py-3 font-medium text-stone-500 text-xs uppercase tracking-wider">Prix</th>
                <th className="px-4 py-3 font-medium text-stone-500 text-xs uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 font-medium text-stone-500 text-xs uppercase tracking-wider">Bestseller</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="px-4 py-3 text-stone-900 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-stone-500">{p.categories?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-stone-900">{p.price.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-stone-500">{p.stock}</td>
                  <td className="px-4 py-3">
                    {p.is_bestseller ? (
                      <span className="text-xs bg-stone-900 text-white px-2 py-0.5">Oui</span>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/produits/${p.id}`} className="text-stone-400 hover:text-stone-700">
                        <Pencil size={15} />
                      </Link>
                      <DeleteButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
