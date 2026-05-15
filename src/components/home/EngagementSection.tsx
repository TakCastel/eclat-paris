export default function EngagementSection() {
  return (
    <section className="bg-[#f5f0eb] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">
              Notre engagement
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight mb-6">
              La beauté,<br /><em>autrement.</em>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6 max-w-md">
              Éclat Paris est née d'une conviction : la beauté devrait être simple, efficace et respectueuse.
              Nos formules courtes, nos ingrédients traçables et notre fabrication française sont notre promesse.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: 'Ingrédients cleans', desc: 'Liste INCI courte et transparente' },
                { title: 'Sans cruauté', desc: 'Cruelty-free & vegan certifié' },
                { title: '0 ingrédients suspects', desc: 'Paraben-free, silicone-free' },
                { title: 'Fabriqué en France', desc: 'Ateliers locaux et responsables' },
              ].map((e) => (
                <div key={e.title}>
                  <p className="text-sm font-medium text-stone-900">{e.title}</p>
                  <p className="text-xs text-stone-500 mt-1">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="bg-stone-200 h-56 rounded-sm overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400"
                alt="Soin naturel"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-stone-200 h-56 rounded-sm overflow-hidden relative mt-8">
              <img
                src="https://images.unsplash.com/photo-1631390967825-21e082befe7c?w=400"
                alt="Formule clean"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
