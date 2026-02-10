import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("UNAUTHORIZED")
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
    const body = await request.json()
    const { name, slug, description, visible, parentId } = body

    const db = await getDb()
    const collection = db.collection("categories")

    const update: Record<string, unknown> = {}
    if (name !== undefined) update.name = name
    if (slug !== undefined) update.slug = slug
    if (description !== undefined) update.description = description
    if (visible !== undefined) update.visible = Boolean(visible)
    if (parentId !== undefined) update.parentId = parentId || null

    let result
    if (ObjectId.isValid(id)) {
      result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: "after" }
      )
    } else {
      result = await collection.findOneAndUpdate(
        { slug: id },
        { $set: update },
        { returnDocument: "after" }
      )
    }

    if (!result) return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 })
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
    const db = await getDb()

    let deleteResult
    if (ObjectId.isValid(id)) {
      deleteResult = await db.collection("categories").deleteOne({ _id: new ObjectId(id) })
    } else {
      deleteResult = await db.collection("categories").deleteOne({ slug: id })
    }

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 })
  }
}
