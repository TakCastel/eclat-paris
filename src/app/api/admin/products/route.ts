import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const products = await db.products.findMany()
    return NextResponse.json(products)
  } catch (err) {
    console.error('GET /api/admin/products:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const product = await db.products.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/products:', err)
    return NextResponse.json({ error: 'Erreur lors de la création du produit', detail: String(err) }, { status: 500 })
  }
}
