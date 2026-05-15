import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const arrayBuffer = await file.arrayBuffer()

    if (process.env.NETLIFY_BLOBS_CONTEXT) {
      const { getStore } = await import('@netlify/blobs')
      const store = getStore('images')
      await store.set(filename, arrayBuffer, { metadata: { contentType: file.type } })
      return NextResponse.json({ url: `/api/images/${filename}` })
    }

    const { writeFile, mkdir } = await import('fs/promises')
    const { join } = await import('path')
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    await writeFile(join(uploadsDir, filename), Buffer.from(arrayBuffer))
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
