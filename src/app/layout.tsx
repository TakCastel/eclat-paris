import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
})

const jost = Jost({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Éclat Paris — Des soins efficaces, sains et sensoriels',
  description:
    'Éclat Paris propose des soins de beauté formulés avec des ingrédients actifs prouvés, fabriqués en France.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-white text-stone-900 antialiased">
        {children}
      </body>
    </html>
  )
}
