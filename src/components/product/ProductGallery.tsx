'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square bg-stone-50 overflow-hidden">
        {images[active] && (
          <Image
            src={images[active]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 bg-stone-50 overflow-hidden border-2 transition-colors ${
                i === active ? 'border-stone-900' : 'border-transparent'
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
