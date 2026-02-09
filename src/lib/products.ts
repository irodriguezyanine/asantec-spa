import type { Product } from "@/types/product"
import { products as staticProducts, getProductsByCategory, getProductBySlug, getFeaturedProducts } from "@/data/products"

const API_BASE = typeof window !== "undefined" ? "" : process.env.NEXTAUTH_URL || "http://localhost:3000"

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getProductsFromApi(): Promise<Product[] | null> {
  return fetchApi<Product[]>("/api/products")
}

export async function getProductsByCategoryFromApi(categorySlug: string): Promise<Product[] | null> {
  return fetchApi<Product[]>(`/api/products?category=${encodeURIComponent(categorySlug)}`)
}

export async function getProductBySlugFromApi(slug: string): Promise<Product | null> {
  return fetchApi<Product>(`/api/products?slug=${encodeURIComponent(slug)}`)
}

export async function getFeaturedProductsFromApi(): Promise<Product[] | null> {
  return fetchApi<Product[]>("/api/products?featured=true")
}

/**
 * Obtiene productos: desde API si existe, sino desde datos estáticos.
 */
export async function getProducts(): Promise<Product[]> {
  const fromApi = await getProductsFromApi()
  return fromApi ?? staticProducts
}

export async function getProductsByCategorySafe(categorySlug: string): Promise<Product[]> {
  const fromApi = await getProductsByCategoryFromApi(categorySlug)
  return fromApi ?? getProductsByCategory(categorySlug)
}

export async function getProductBySlugSafe(slug: string): Promise<Product | undefined> {
  const fromApi = await getProductBySlugFromApi(slug)
  return fromApi ?? getProductBySlug(slug)
}

export async function getFeaturedProductsSafe(): Promise<Product[]> {
  const fromApi = await getFeaturedProductsFromApi()
  return fromApi ?? getFeaturedProducts()
}
