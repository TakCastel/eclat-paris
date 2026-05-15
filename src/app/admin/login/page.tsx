'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/admin'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="bg-white border border-stone-200 p-8 w-full max-w-sm">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Admin</p>
        <h1 className="font-serif text-2xl text-stone-900 mb-8">Éclat Paris</h1>

        <form action={action} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-400"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-stone-900 text-white text-sm py-2.5 hover:bg-stone-700 disabled:opacity-50"
          >
            {pending ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
