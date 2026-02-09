import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const collection = db.collection("categories")
    const docs = await collection.find({}).toArray()

    if (docs.length === 0) {
      const defaultCategories = [
        { id: "computadores", name: "Computadores", slug: "computadores", description: "Notebooks, PCs de escritorio y todo en uno" },
        { id: "monitores", name: "Monitores", slug: "monitores", description: "Pantallas y monitores para oficina y gaming" },
        { id: "perifericos", name: "Periféricos", slug: "perifericos", description: "Teclados, mouse, webcams y más" },
        { id: "impresoras", name: "Impresoras", slug: "impresoras", description: "Impresoras y multifuncionales" },
        { id: "almacenamiento", name: "Almacenamiento", slug: "almacenamiento", description: "Discos duros, SSD, memorias" },
        { id: "red-y-conectividad", name: "Red y conectividad", slug: "red-y-conectividad", description: "Cables, conectores, redes" },
      ]
      await collection.insertMany(defaultCategories)
      const inserted = await collection.find({}).toArray()
      return NextResponse.json(inserted.map((d) => ({ ...d, id: d._id.toString() })))
    }

    return NextResponse.json(docs.map((d) => ({ ...d, id: (d as { _id: { toString: () => string } })._id?.toString?.() || d.id })))
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json({ error: "Error al cargar categorías" }, { status: 500 })
  }
}
