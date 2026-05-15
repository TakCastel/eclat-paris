'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return
    setLoading(true)
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-stone-300 hover:text-red-400 disabled:opacity-50"
    >
      <Trash2 size={15} />
    </button>
  )
}
