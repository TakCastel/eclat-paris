import { prisma } from './prisma'
import type { Product, Category } from './types'

function parseProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    tagline: p.tagline ?? null,
    description: p.description ?? null,
    ingredients: p.ingredients ?? null,
    category_id: p.categoryId ?? null,
    price: p.price,
    compare_price: p.comparePrice ?? null,
    images: JSON.parse(p.images ?? '[]'),
    rating: p.rating,
    review_count: p.reviewCount,
    stock: p.stock,
    sizes: JSON.parse(p.sizes ?? '[]'),
    skin_types: JSON.parse(p.skinTypes ?? '[]'),
    is_bestseller: p.isBestseller,
    created_at: p.createdAt?.toISOString() ?? '',
    categories: p.category ? parseCategory(p.category) : undefined,
  }
}

function parseCategory(c: any): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image_url: c.imageUrl ?? null,
    created_at: c.createdAt?.toISOString() ?? '',
  }
}

function serializeProduct(data: Partial<Product>) {
  const out: Record<string, unknown> = {}
  if (data.name !== undefined) out.name = data.name
  if (data.slug !== undefined) out.slug = data.slug
  if (data.tagline !== undefined) out.tagline = data.tagline
  if (data.description !== undefined) out.description = data.description
  if (data.ingredients !== undefined) out.ingredients = data.ingredients
  if (data.category_id !== undefined) out.categoryId = data.category_id
  if (data.price !== undefined) out.price = data.price
  if (data.compare_price !== undefined) out.comparePrice = data.compare_price
  if (data.images !== undefined) out.images = JSON.stringify(data.images)
  if (data.stock !== undefined) out.stock = data.stock
  if (data.sizes !== undefined) out.sizes = JSON.stringify(data.sizes)
  if (data.skin_types !== undefined) out.skinTypes = JSON.stringify(data.skin_types)
  if (data.is_bestseller !== undefined) out.isBestseller = data.is_bestseller
  return out
}

export const db = {
  categories: {
    async findAll(): Promise<Category[]> {
      const data = await prisma.category.findMany({ orderBy: { name: 'asc' } })
      return data.map(parseCategory)
    },
  },

  products: {
    async findMany(filters?: {
      categorySlug?: string
      skinType?: string
      minPrice?: number
      maxPrice?: number
      orderBy?: string
      bestseller?: boolean
    }): Promise<Product[]> {
      const where: any = {}

      if (filters?.categorySlug) {
        const cat = await prisma.category.findUnique({ where: { slug: filters.categorySlug } })
        if (cat) where.categoryId = cat.id
      }
      if (filters?.skinType) {
        where.skinTypes = { contains: filters.skinType }
      }
      if (filters?.minPrice !== undefined) where.price = { ...where.price, gte: filters.minPrice }
      if (filters?.maxPrice !== undefined) where.price = { ...where.price, lte: filters.maxPrice }
      if (filters?.bestseller) where.isBestseller = true

      let orderBy: any = { createdAt: 'desc' }
      if (filters?.orderBy === 'price_asc') orderBy = { price: 'asc' }
      else if (filters?.orderBy === 'price_desc') orderBy = { price: 'desc' }
      else if (filters?.orderBy === 'rating') orderBy = { rating: 'desc' }

      const data = await prisma.product.findMany({
        where,
        orderBy,
        include: { category: true },
      })
      return data.map(parseProduct)
    },

    async findBySlug(slug: string): Promise<Product | null> {
      const data = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      })
      return data ? parseProduct(data) : null
    },

    async findById(id: string): Promise<Product | null> {
      const data = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
      })
      return data ? parseProduct(data) : null
    },

    async create(data: Partial<Product>): Promise<Product> {
      const created = await prisma.product.create({
        data: serializeProduct(data) as any,
        include: { category: true },
      })
      return parseProduct(created)
    },

    async update(id: string, data: Partial<Product>): Promise<Product> {
      const updated = await prisma.product.update({
        where: { id },
        data: serializeProduct(data) as any,
        include: { category: true },
      })
      return parseProduct(updated)
    },

    async delete(id: string): Promise<void> {
      await prisma.product.delete({ where: { id } })
    },
  },

  orders: {
    async create(data: {
      email: string
      subtotal: number
      shipping: number
      total: number
      shippingFirstname: string
      shippingLastname: string
      shippingAddress: string
      shippingCity: string
      shippingPostalCode: string
      shippingCountry: string
      shippingMethod: string
      items: {
        productId: string | null
        productName: string
        productImage: string | null
        size: string | null
        quantity: number
        unitPrice: number
      }[]
    }) {
      return prisma.order.create({
        data: {
          email: data.email,
          subtotal: data.subtotal,
          shipping: data.shipping,
          total: data.total,
          shippingFirstname: data.shippingFirstname,
          shippingLastname: data.shippingLastname,
          shippingAddress: data.shippingAddress,
          shippingCity: data.shippingCity,
          shippingPostalCode: data.shippingPostalCode,
          shippingCountry: data.shippingCountry,
          shippingMethod: data.shippingMethod,
          items: { create: data.items },
        },
      })
    },

    async updateStatus(id: string, status: string) {
      return prisma.order.update({ where: { id }, data: { status } })
    },

    async linkStripeSession(id: string, stripeSessionId: string) {
      return prisma.order.update({ where: { id }, data: { stripeSessionId } })
    },

    async findByStripeSession(stripeSessionId: string) {
      return prisma.order.findUnique({ where: { stripeSessionId } })
    },
  },
}
