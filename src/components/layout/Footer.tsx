import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Newsletter */}
      <div className="border-b border-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-white text-xl">Rejoignez la communauté Éclat</p>
            <p className="text-sm text-stone-400 mt-1">Recevez nos nouveautés, conseils beauté et offres exclusives.</p>
          </div>
          <form className="flex w-full md:w-auto gap-0">
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              className="flex-1 md:w-72 px-4 py-3 bg-stone-800 text-white text-sm placeholder-stone-500 border border-stone-700 focus:outline-none focus:border-stone-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-stone-900 text-sm font-medium hover:bg-stone-100 transition-colors whitespace-nowrap"
            >
              S'abonner
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-white text-sm font-medium mb-4 tracking-wider uppercase">Nos soins</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/catalogue?categorie=soins-visage" className="hover:text-white transition-colors">Soins visage</Link></li>
            <li><Link href="/catalogue?categorie=maquillage" className="hover:text-white transition-colors">Maquillage</Link></li>
            <li><Link href="/catalogue?categorie=corps" className="hover:text-white transition-colors">Corps</Link></li>
            <li><Link href="/catalogue?categorie=coffrets" className="hover:text-white transition-colors">Coffrets</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-4 tracking-wider uppercase">La marque</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/engagements" className="hover:text-white transition-colors">Nos engagements</Link></li>
            <li><Link href="/histoire" className="hover:text-white transition-colors">Notre histoire</Link></li>
            <li><Link href="/ingredients" className="hover:text-white transition-colors">Nos ingrédients</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-4 tracking-wider uppercase">Aide</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/livraison" className="hover:text-white transition-colors">Livraison & retours</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-4 tracking-wider uppercase">Suivez-nous</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors text-sm tracking-wider">Instagram</a>
            <a href="#" className="hover:text-white transition-colors text-sm tracking-wider">Facebook</a>
          </div>
          <p className="text-xs text-stone-500 mt-6">Paiement sécurisé<br />Visa · Mastercard · PayPal</p>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Éclat Paris. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-stone-300">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-stone-300">Confidentialité</Link>
            <Link href="/cgv" className="hover:text-stone-300">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
