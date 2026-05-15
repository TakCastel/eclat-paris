'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const SKIN_TYPES = ['Peau mixte', 'Peau grasse', 'Peau sèche', 'Peau sensible', 'Peau normale', 'Toutes peaux']
const PRICE_RANGES = [
  { label: 'Moins de 20€', value: '0-20' },
  { label: '20€ – 35€', value: '20-35' },
  { label: 'Plus de 35€', value: '35-999' },
]
const SORT_OPTIONS = [
  { label: 'Tri par défaut', value: '' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' },
  { label: 'Mieux notés', value: 'rating' },
]

interface FilterGroup {
  title: string
  children: React.ReactNode
}

function FilterGroup({ title, children }: FilterGroup) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-stone-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-medium text-stone-900 mb-3"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  )
}

export default function CatalogFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString())
    if (value) {
      p.set(key, value)
    } else {
      p.delete(key)
    }
    router.push(`/catalogue?${p.toString()}`)
  }

  const toggleParam = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString())
    if (p.get(key) === value) {
      p.delete(key)
    } else {
      p.set(key, value)
    }
    router.push(`/catalogue?${p.toString()}`)
  }

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      <FilterGroup title="Type de peau">
        <div className="space-y-2">
          {SKIN_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={params.get('peau') === t}
                onChange={() => toggleParam('peau', t)}
                className="accent-stone-800"
              />
              <span className="text-xs text-stone-700">{t}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Prix">
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <label key={r.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="prix"
                checked={params.get('prix') === r.value}
                onChange={() => toggleParam('prix', r.value)}
                className="accent-stone-800"
              />
              <span className="text-xs text-stone-700">{r.label}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <div className="pt-4">
        <button
          onClick={() => router.push('/catalogue')}
          className="text-xs text-stone-400 underline underline-offset-2 hover:text-stone-700"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </aside>
  )
}
