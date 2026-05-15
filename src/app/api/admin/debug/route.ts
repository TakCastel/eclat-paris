import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const info: Record<string, unknown> = {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/eyJ[^@]+/g, '[TOKEN]') : 'NOT SET',
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN ? 'SET (length=' + process.env.DATABASE_AUTH_TOKEN.length + ')' : 'NOT SET',
    NETLIFY: process.env.NETLIFY,
    NETLIFY_BLOBS_CONTEXT: process.env.NETLIFY_BLOBS_CONTEXT ? 'SET' : 'NOT SET',
  }

  try {
    const count = await prisma.$queryRaw`SELECT COUNT(*) as count FROM Product`
    info.db = 'OK'
    info.productCount = count
  } catch (err) {
    info.db = 'ERROR'
    info.dbError = String(err)
  }

  return NextResponse.json(info)
}
