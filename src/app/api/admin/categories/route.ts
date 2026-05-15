import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const categories = await db.categories.findAll()
  return NextResponse.json(categories)
}
