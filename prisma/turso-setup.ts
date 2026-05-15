import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const url = process.env.DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN

if (!url || !url.startsWith('libsql://')) {
  console.error('DATABASE_URL doit être une URL Turso (libsql://...)')
  process.exit(1)
}

const db = createClient({ url, authToken })

async function main() {
  console.log('Connexion à Turso...')

  // Appliquer la migration
  const sql = readFileSync(
    join(process.cwd(), 'prisma/migrations/20260514203424_init/migration.sql'),
    'utf-8'
  )

  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  console.log(`Application de ${statements.length} instructions SQL...`)
  for (const stmt of statements) {
    await db.execute(stmt)
  }

  // Insérer les données de démo
  console.log('Insertion des données...')

  const soinsVisage = await db.execute(
    `INSERT OR IGNORE INTO Category (id, name, slug, createdAt) VALUES ('cat-soins', 'Soins Visage', 'soins-visage', datetime('now')) RETURNING id`
  )
  const maquillage = await db.execute(
    `INSERT OR IGNORE INTO Category (id, name, slug, createdAt) VALUES ('cat-maquillage', 'Maquillage', 'maquillage', datetime('now')) RETURNING id`
  )
  const corps = await db.execute(
    `INSERT OR IGNORE INTO Category (id, name, slug, createdAt) VALUES ('cat-corps', 'Corps', 'corps', datetime('now')) RETURNING id`
  )
  const coffrets = await db.execute(
    `INSERT OR IGNORE INTO Category (id, name, slug, createdAt) VALUES ('cat-coffrets', 'Coffrets', 'coffrets', datetime('now')) RETURNING id`
  )

  const products = [
    {
      id: 'prod-1', name: 'Sérum Éclat à la Niacinamide', slug: 'serum-eclat-niacinamide',
      tagline: 'Le sérum qui illumine et resserre les pores',
      description: "Ce sérum concentré alliant niacinamide et acide hyaluronique réduit les pores et apporte un éclat immédiat.",
      categoryId: 'cat-soins', price: 29.0, comparePrice: null,
      images: '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600"]',
      rating: 4.8, reviewCount: 127, stock: 100,
      sizes: '["30 ml","50 ml"]', skinTypes: '["Peau mixte","Peau grasse","Peau terne"]', isBestseller: 1,
    },
    {
      id: 'prod-2', name: 'Crème Hydratante Éclat', slug: 'creme-hydratante-eclat',
      tagline: 'Hydratation profonde 24h, teint unifié',
      description: "Formulée avec de l'acide hyaluronique triple poids et du beurre de karité.",
      categoryId: 'cat-soins', price: 35.0, comparePrice: null,
      images: '["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600"]',
      rating: 4.6, reviewCount: 89, stock: 80,
      sizes: '["50 ml"]', skinTypes: '["Peau sèche","Peau mixte","Peau sensible"]', isBestseller: 1,
    },
    {
      id: 'prod-3', name: 'Mascara Volume Intense', slug: 'mascara-volume-intense',
      tagline: 'Volume extrême, tenue 24h sans transfert',
      description: 'Ce mascara enrichi en kératine végétale gaine chaque cil pour un volume multiplié par 10.',
      categoryId: 'cat-maquillage', price: 19.0, comparePrice: null,
      images: '["https://images.unsplash.com/photo-1631214498942-d9efd01c5de0?w=600"]',
      rating: 4.7, reviewCount: 203, stock: 200,
      sizes: '["8 ml"]', skinTypes: '["Tous types"]', isBestseller: 1,
    },
    {
      id: 'prod-4', name: 'Huile Sèche Corps & Cheveux', slug: 'huile-seche-corps-cheveux',
      tagline: 'Peau soyeuse, cheveux brillants',
      description: "Cette huile sèche multi-usage pénètre instantanément sans laisser de film gras.",
      categoryId: 'cat-corps', price: 32.0, comparePrice: null,
      images: '["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600"]',
      rating: 4.9, reviewCount: 41, stock: 60,
      sizes: '["100 ml"]', skinTypes: '["Peau sèche","Peau normale"]', isBestseller: 0,
    },
    {
      id: 'prod-5', name: 'Coffret Essentiels Éclat', slug: 'coffret-essentiels-eclat',
      tagline: 'La routine complète pour un teint parfait',
      description: 'Ce coffret réunit nos 3 bestsellers : le Sérum Éclat, la Crème Hydratante et la Crème Nettoyante.',
      categoryId: 'cat-coffrets', price: 69.0, comparePrice: 86.0,
      images: '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"]',
      rating: 4.9, reviewCount: 18, stock: 30,
      sizes: '["Format découverte"]', skinTypes: '["Toutes peaux"]', isBestseller: 1,
    },
  ]

  for (const p of products) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO Product
        (id, name, slug, tagline, description, categoryId, price, comparePrice, images, rating, reviewCount, stock, sizes, skinTypes, isBestseller, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      args: [p.id, p.name, p.slug, p.tagline, p.description, p.categoryId, p.price, p.comparePrice, p.images, p.rating, p.reviewCount, p.stock, p.sizes, p.skinTypes, p.isBestseller],
    })
  }

  console.log('✓ Base Turso initialisée avec succès !')
  await db.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
