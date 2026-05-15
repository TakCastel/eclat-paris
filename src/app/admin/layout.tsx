import Link from 'next/link'
import { logout } from '@/app/actions/admin'
import { Package, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 flex">
      <aside className="w-56 bg-white border-r border-stone-200 flex flex-col">
        <div className="px-6 py-5 border-b border-stone-100">
          <p className="text-xs tracking-widest uppercase text-stone-400">Admin</p>
          <p className="font-serif text-lg text-stone-900 mt-0.5">Éclat Paris</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/admin/produits"
            className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 rounded hover:bg-stone-50"
          >
            <Package size={16} />
            Produits
          </Link>
        </nav>

        <form action={logout} className="px-3 py-4 border-t border-stone-100">
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 text-sm text-stone-400 hover:text-stone-700 w-full rounded hover:bg-stone-50"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
