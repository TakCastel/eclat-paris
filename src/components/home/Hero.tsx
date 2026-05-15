import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-[#f5f0eb] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 max-w-xl">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-4">
            L'essentiel de la beauté
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-stone-900 leading-tight mb-6">
            Des soins efficaces,<br />
            <em>sains et sensoriels</em>
          </h1>
          <p className="text-stone-600 leading-relaxed mb-8 max-w-sm">
            Une formule clean, composée par la nature pour révéler votre éclat naturel.
          </p>
          <Link
            href="/catalogue"
            className="inline-block bg-stone-900 text-white text-sm tracking-widest uppercase px-8 py-4 hover:bg-stone-700 transition-colors"
          >
            Acheter nos soins
          </Link>
        </div>
        <div className="flex-1 flex justify-center relative">
          <div className="relative w-80 h-96 md:w-96 md:h-[480px]">
            <Image
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"
              alt="Éclat Paris — produits de soin"
              fill
              className="object-cover rounded-sm"
              priority
              sizes="(max-width: 768px) 320px, 384px"
            />
          </div>
          {/* Badge flottant */}
          <div className="absolute -bottom-4 -left-4 md:bottom-8 md:left-0 bg-white shadow-lg px-5 py-3">
            <p className="text-xs text-stone-500 tracking-wide">Formule clean & naturelle</p>
            <p className="font-serif text-stone-900 mt-0.5">Sans parabènes · Sans silicones</p>
          </div>
        </div>
      </div>

      {/* Valeurs */}
      <div className="border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '✦', label: 'Formule clean', desc: 'Ingrédients sélectionnés' },
            { icon: '◎', label: 'Efficacité prouvée', desc: 'Résultats cliniquement testés' },
            { icon: '❋', label: 'Essentiels naturels', desc: "Actifs d'origine naturelle" },
            { icon: '◈', label: 'Fabriqué en France', desc: 'Éthique & responsable' },
          ].map((v) => (
            <div key={v.label} className="flex flex-col items-center text-center gap-2">
              <span className="text-stone-400 text-lg">{v.icon}</span>
              <p className="text-xs font-medium text-stone-900 tracking-wide">{v.label}</p>
              <p className="text-xs text-stone-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
