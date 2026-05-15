import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await db.products.findById(id)
    if (!product) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    return NextResponse.json(product)
  } catch (err) {
    console.error('GET /api/admin/products/[id]:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const product = await db.products.update(id, body)
    return NextResponse.json(product)
  } catch (err) {
    console.error('PUT /api/admin/products/[id]:', err)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.products.delete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/products/[id]:', err)
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
