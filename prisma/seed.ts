import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const soinsVisage = await prisma.category.upsert({
    where: { slug: 'soins-visage' },
    update: {},
    create: { name: 'Soins Visage', slug: 'soins-visage' },
  })
  const maquillage = await prisma.category.upsert({
    where: { slug: 'maquillage' },
    update: {},
    create: { name: 'Maquillage', slug: 'maquillage' },
  })
  const corps = await prisma.category.upsert({
    where: { slug: 'corps' },
    update: {},
    create: { name: 'Corps', slug: 'corps' },
  })
  const coffrets = await prisma.category.upsert({
    where: { slug: 'coffrets' },
    update: {},
    create: { name: 'Coffrets', slug: 'coffrets' },
  })

  const products = [
    {
      name: 'Sérum Éclat à la Niacinamide',
      slug: 'serum-eclat-niacinamide',
      tagline: 'Le sérum qui illumine et resserre les pores',
      description: "Ce sérum concentré alliant niacinamide et acide hyaluronique cible l'apparence des décolorations, réduit les pores de moitié et apporte un éclat immédiat.",
      categoryId: soinsVisage.id,
      price: 29.0,
      images: JSON.stringify(['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600']),
      rating: 4.8,
      reviewCount: 127,
      stock: 100,
      sizes: JSON.stringify(['30 ml', '50 ml']),
      skinTypes: JSON.stringify(['Peau mixte', 'Peau grasse', 'Peau terne']),
      isBestseller: true,
    },
    {
      name: 'Crème Hydratante Éclat',
      slug: 'creme-hydratante-eclat',
      tagline: 'Hydratation profonde 24h, teint unifié',
      description: "Formulée avec de l'acide hyaluronique triple poids et du beurre de karité, cette crème nourrit intensément tout en lissant la texture de la peau.",
      categoryId: soinsVisage.id,
      price: 35.0,
      images: JSON.stringify(['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600']),
      rating: 4.6,
      reviewCount: 89,
      stock: 80,
      sizes: JSON.stringify(['50 ml']),
      skinTypes: JSON.stringify(['Peau sèche', 'Peau mixte', 'Peau sensible']),
      isBestseller: true,
    },
    {
      name: 'Mascara Volume Intense',
      slug: 'mascara-volume-intense',
      tagline: 'Volume extrême, tenue 24h sans transfert',
      description: 'Ce mascara enrichi en kératine végétale gaine chaque cil pour un volume multiplié par 10.',
      categoryId: maquillage.id,
      price: 19.0,
      images: JSON.stringify(['https://images.unsplash.com/photo-1631214498942-d9efd01c5de0?w=600']),
      rating: 4.7,
      reviewCount: 203,
      stock: 200,
      sizes: JSON.stringify(['8 ml']),
      skinTypes: JSON.stringify(['Tous types']),
      isBestseller: true,
    },
    {
      name: 'Huile Sèche Corps & Cheveux',
      slug: 'huile-seche-corps-cheveux',
      tagline: 'Peau soyeuse, cheveux brillants',
      description: "Cette huile sèche multi-usage pénètre instantanément sans laisser de film gras.",
      categoryId: corps.id,
      price: 32.0,
      images: JSON.stringify(['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600']),
      rating: 4.9,
      reviewCount: 41,
      stock: 60,
      sizes: JSON.stringify(['100 ml']),
      skinTypes: JSON.stringify(['Peau sèche', 'Peau normale']),
      isBestseller: false,
    },
    {
      name: 'Coffret Essentiels Éclat',
      slug: 'coffret-essentiels-eclat',
      tagline: 'La routine complète pour un teint parfait',
      description: 'Ce coffret réunit nos 3 bestsellers : le Sérum Éclat, la Crème Hydratante et la Crème Nettoyante.',
      categoryId: coffrets.id,
      price: 69.0,
      comparePrice: 86.0,
      images: JSON.stringify(['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600']),
      rating: 4.9,
      reviewCount: 18,
      stock: 30,
      sizes: JSON.stringify(['Format découverte']),
      skinTypes: JSON.stringify(['Toutes peaux']),
      isBestseller: true,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('Base de données initialisée avec les données de démonstration.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
