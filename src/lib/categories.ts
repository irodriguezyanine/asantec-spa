import type { Category } from "@/types/product"
import { categories as staticCategories } from "@/data/products"

const API_BASE = typeof window !== "undefined" ? "" : process.env.NEXTAUTH_URL || "http://localhost:3000"

async function fetchCategories(admin = false): Promise<Category[] | null> {
  try {
    const url = `${API_BASE}/api/categories${admin ? "?admin=true" : ""}`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

export async function getCategoriesSafe(): Promise<Category[]> {
  const fromApi = await fetchCategories(false)
  return fromApi ?? staticCategories
}

export async function getCategoriesAdmin(): Promise<Category[]> {
  const fromApi = await fetchCategories(true)
  return fromApi ?? staticCategories
}
