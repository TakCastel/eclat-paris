export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  ingredients: string | null
  category_id: string | null
  price: number
  compare_price: number | null
  images: string[]
  rating: number
  review_count: number
  stock: number
  sizes: string[]
  skin_types: string[]
  is_bestseller: boolean
  created_at: string
  categories?: Category
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string | null
}

export interface Order {
  id: string
  email: string
  status: string
  subtotal: number
  shipping: number
  total: number
  shipping_firstname: string | null
  shipping_lastname: string | null
  shipping_address: string | null
  shipping_city: string | null
  shipping_postal_code: string | null
  shipping_country: string
  shipping_method: string
  stripe_session_id: string | null
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string | null
  size: string | null
  quantity: number
  unit_price: number
}

export interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  shippingMethod: 'standard' | 'express'
}
