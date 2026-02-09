import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import type { Product } from "@/types/product"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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
    visible: doc.visible as boolean | undefined,
    specs: doc.specs as Record<string, string> | undefined,
  }
}

async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("UNAUTHORIZED")
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const doc = await db.collection("products").findOne({ _id: new ObjectId(id) })
    if (!doc) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })

    return NextResponse.json(formatProduct(doc as Record<string, unknown>))
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json({ error: "Error al cargar producto" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { name, brand, category, categorySlug, description, price, image, images, featured, inStock, visible } = body

    const db = await getDb()
    const collection = db.collection("products")

    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (name !== undefined) update.name = name
    if (brand !== undefined) update.brand = brand
    if (category !== undefined) update.category = category
    if (categorySlug !== undefined) update.categorySlug = categorySlug
    if (description !== undefined) update.description = description
    if (price !== undefined) update.price = Number(price)
    if (image !== undefined) update.image = image
    if (images !== undefined) update.images = images
    if (featured !== undefined) update.featured = Boolean(featured)
    if (inStock !== undefined) update.inStock = inStock
    if (visible !== undefined) update.visible = Boolean(visible)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    )

    if (!result) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    return NextResponse.json(formatProduct(result as unknown as Record<string, unknown>))
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
