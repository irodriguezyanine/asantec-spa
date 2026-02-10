import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get("admin") === "true"

    const db = await getDb()
    const collection = db.collection("categories")
    const query: Record<string, unknown> = {}
    if (!admin) {
      query.$or = [{ visible: { $ne: false } }, { visible: { $exists: false } }]
    }
    const docs = await collection.find(query).sort({ name: 1 }).toArray()

    if (docs.length === 0 && !admin) {
      const defaultCategories = [
        { id: "computadores", name: "Computadores", slug: "computadores", description: "Notebooks, PCs de escritorio y todo en uno", visible: true },
        { id: "monitores", name: "Monitores", slug: "monitores", description: "Pantallas y monitores para oficina y gaming", visible: true },
        { id: "perifericos", name: "Periféricos", slug: "perifericos", description: "Teclados, mouse, webcams y más", visible: true },
        { id: "impresoras", name: "Impresoras", slug: "impresoras", description: "Impresoras y multifuncionales", visible: true },
        { id: "almacenamiento", name: "Almacenamiento", slug: "almacenamiento", description: "Discos duros, SSD, memorias", visible: true },
        { id: "red-y-conectividad", name: "Red y conectividad", slug: "red-y-conectividad", description: "Cables, conectores, redes", visible: true },
      ]
      await collection.insertMany(defaultCategories)
      const inserted = await collection.find({}).toArray()
      return NextResponse.json(inserted.map((d) => ({ ...d, id: d._id.toString() })))
    }

    return NextResponse.json(docs.map((d) => ({ ...d, id: (d as { _id: { toString: () => string } })._id?.toString?.() || (d as { id?: string }).id })))
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json({ error: "Error al cargar categorías" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const name = String(body.name || "").trim()
    const slug =
      body.slug?.trim() ||
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")

    if (!name || !slug) {
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400 })
    }

    const db = await getDb()
    const collection = db.collection("categories")
    const existing = await collection.findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: "Ya existe una categoría con ese slug" }, { status: 400 })
    }

    await collection.insertOne({
      id: slug,
      name,
      slug,
      description: body.description || "",
      visible: body.visible !== false,
      parentId: body.parentId || null,
    })
    const inserted = await collection.findOne({ slug })
    return NextResponse.json({ ...inserted, id: (inserted as { _id: { toString: () => string } })._id.toString() }, { status: 201 })
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 })
  }
}
