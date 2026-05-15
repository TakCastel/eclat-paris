import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const prix = searchParams.get('prix')

  const products = await db.products.findMany({
    categorySlug: searchParams.get('categorie') ?? undefined,
    skinType: searchParams.get('peau') ?? undefined,
    bestseller: searchParams.get('bestseller') === 'true' || undefined,
    ...(prix ? {
      minPrice: Number(prix.split('-')[0]),
      maxPrice: Number(prix.split('-')[1]),
    } : {}),
  })

  return NextResponse.json(products)
}
