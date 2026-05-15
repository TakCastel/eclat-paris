import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { CartItem, CheckoutFormData } from '@/lib/types'

interface CheckoutBody {
  items: CartItem[]
  form: CheckoutFormData
  shippingCost: number
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()
    const { items, form, shippingCost } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const total = subtotal + shippingCost

    const order = await db.orders.create({
      email: form.email,
      subtotal,
      shipping: shippingCost,
      total,
      shippingFirstname: form.firstName,
      shippingLastname: form.lastName,
      shippingAddress: form.address,
      shippingCity: form.city,
      shippingPostalCode: form.postalCode,
      shippingCountry: form.country,
      shippingMethod: form.shippingMethod,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] ?? null,
        size: item.selectedSize,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      locale: 'fr',
      customer_email: form.email,
      line_items: [
        ...items.map((item) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.product.name,
              images: item.product.images.slice(0, 1),
              description: item.selectedSize ? `Contenance : ${item.selectedSize}` : undefined,
            },
            unit_amount: Math.round(item.product.price * 100),
          },
          quantity: item.quantity,
        })),
        ...(shippingCost > 0
          ? [{
              price_data: {
                currency: 'eur' as const,
                product_data: { name: 'Frais de livraison' },
                unit_amount: Math.round(shippingCost * 100),
              },
              quantity: 1,
            }]
          : []),
      ],
      metadata: { order_id: order.id },
      success_url: `${siteUrl}/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    })

    await db.orders.linkStripeSession(order.id, session.id)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
