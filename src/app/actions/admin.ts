'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const password = formData.get('password') as string
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    return { error: 'Mot de passe incorrect' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  redirect('/admin/produits')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
