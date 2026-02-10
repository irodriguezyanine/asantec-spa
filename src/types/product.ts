export interface Product {
  id: string
  name: string
  slug: string
  brand: string
  category: string
  categorySlug: string
  description: string
  price: number
  priceFormatted: string
  image: string
  images?: string[]
  featured?: boolean
  inStock?: boolean
  visible?: boolean
  showPublicPrice?: boolean
  specs?: Record<string, string>
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  productCount?: number
}
