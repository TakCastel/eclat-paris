import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  try {
    const { getStore } = await import('@netlify/blobs')
    const store = getStore('images')
    const result = await store.getWithMetadata(filename, { type: 'arrayBuffer' })

    if (!result) {
      return NextResponse.json({ error: 'Image introuvable' }, { status: 404 })
    }

    const contentType = (result.metadata?.contentType as string) ?? 'image/jpeg'
    return new NextResponse(result.data as ArrayBuffer, {
      headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=31536000' },
    })
  } catch (err) {
    console.error('Image serve error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
