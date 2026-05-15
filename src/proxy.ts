import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('admin_session')?.value
  const password = process.env.ADMIN_PASSWORD

  const isLoginPage = pathname === '/admin/login'
  const isApiRoute = pathname.startsWith('/api/admin')
  const isAdminPage = pathname.startsWith('/admin')

  if (isLoginPage) {
    if (password && session === password) {
      return NextResponse.redirect(new URL('/admin/produits', request.url))
    }
    return NextResponse.next()
  }

  if (isAdminPage || isApiRoute) {
    if (!password || session !== password) {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
