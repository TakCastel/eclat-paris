import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ProductForm from '@/components/admin/ProductForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProduitPage({ params }: Props) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    db.products.findById(id),
    db.categories.findAll(),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900 mb-8">Modifier le produit</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
