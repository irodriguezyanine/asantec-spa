import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import type { Product } from "@/types/product"

function formatProduct(doc: Record<string, unknown>): Product {
  return {
    id: (doc._id as { toString: () => string }).toString(),
    name: doc.name as string,
    slug: doc.slug as string,
    brand: doc.brand as string,
    category: doc.category as string,
    categorySlug: doc.categorySlug as string,
    description: doc.description as string,
    price: doc.price as number,
    priceFormatted: `$${(doc.price as number).toLocaleString("es-CL")}`,
    image: (doc.image as string) || "",
    images: doc.images as string[] | undefined,
    featured: doc.featured as boolean | undefined,
    inStock: doc.inStock as boolean | undefined,
    specs: doc.specs as Record<string, string> | undefined,
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")
    const featured = searchParams.get("featured")
    const slug = searchParams.get("slug")

    const db = await getDb()
    const collection = db.collection("products")

    if (slug) {
      const doc = await collection.findOne({ slug })
      if (!doc) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
      return NextResponse.json(formatProduct(doc))
    }

    let query: Record<string, unknown> = {}
    if (categorySlug) query.categorySlug = categorySlug
    if (featured === "true") query.featured = true

    const docs = await collection.find(query).toArray()
    const products = docs.map(formatProduct)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al cargar productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, brand, category, categorySlug, description, price, image, images, featured, inStock } = body

    if (!name || !categorySlug) {
      return NextResponse.json({ error: "Nombre, slug y categoría son requeridos" }, { status: 400 })
    }

    const slug = body.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const db = await getDb()
    const collection = db.collection("products")

    const existing = await collection.findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: "Ya existe un producto con ese slug" }, { status: 400 })
    }

    const doc = {
      name,
      slug,
      brand: brand || "Genérico",
      category: category || categorySlug,
      categorySlug,
      description: description || "",
      price: Number(price) || 0,
      image: image || "",
      images: images || [],
      featured: Boolean(featured),
      inStock: inStock !== false,
      createdAt: new Date(),
    }

    const result = await collection.insertOne(doc)
    const inserted = await collection.findOne({ _id: result.insertedId })
    return NextResponse.json(formatProduct(inserted as Record<string, unknown>), { status: 201 })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
