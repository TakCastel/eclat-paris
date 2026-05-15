import { db } from '@/lib/db'
import ProductForm from '@/components/admin/ProductForm'

export default async function NouveauProduitPage() {
  const categories = await db.categories.findAll()

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900 mb-8">Nouveau produit</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
