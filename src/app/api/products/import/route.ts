import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import * as XLSX from "xlsx"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 }) as string[][]

    if (rows.length < 2) {
      return NextResponse.json(
        { error: "El archivo debe tener al menos una fila de encabezados y una de datos" },
        { status: 400 }
      )
    }

    const headers = rows[0].map((h) => String(h || "").trim().toLowerCase())
    const nameIdx = headers.findIndex((h) => h.includes("nombre") || h === "name")
    const priceIdx = headers.findIndex((h) => h.includes("precio") || h === "price")
    const categoryIdx = headers.findIndex((h) => h.includes("categoria") || h.includes("categoría") || h === "category")
    const brandIdx = headers.findIndex((h) => h.includes("marca") || h === "brand")
    const descIdx = headers.findIndex((h) => h.includes("descripcion") || h.includes("descripción") || h === "description")
    const imageIdx = headers.findIndex((h) => h.includes("imagen") || h.includes("foto") || h === "image")
    const visibleIdx = headers.findIndex((h) => h.includes("visible") || h.includes("mostrar"))
    const featuredIdx = headers.findIndex((h) => h.includes("destacado") || h.includes("featured"))

    if (nameIdx === -1) {
      return NextResponse.json(
        {
          error: "Falta columna obligatoria. El Excel debe tener al menos: nombre, precio, categoria. Puede incluir: marca, descripcion, imagen, visible, destacado.",
        },
        { status: 400 }
      )
    }

    const db = await getDb()
    const productsCollection = db.collection("products")
    const categoriesCollection = db.collection("categories")

    const categoryMap = new Map<string, { name: string; slug: string }>()
    const catDocs = await categoriesCollection.find({}).toArray()
    for (const c of catDocs) {
      const doc = c as { slug: string; name: string }
      categoryMap.set(doc.slug.toLowerCase(), { name: doc.name, slug: doc.slug })
      categoryMap.set(doc.name.toLowerCase(), { name: doc.name, slug: doc.slug })
    }

    let imported = 0
    const errors: string[] = []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (!row || row.length === 0) continue

      const name = String(row[nameIdx] ?? "").trim()
      if (!name) continue

      const priceRaw = row[priceIdx]
      const price = typeof priceRaw === "number" ? priceRaw : parseInt(String(priceRaw || "0").replace(/\D/g, ""), 10) || 0

      let categorySlug = "general"
      let categoryName = "General"
      if (categoryIdx >= 0 && row[categoryIdx]) {
        const catVal = String(row[categoryIdx]).trim()
        if (catVal) {
          const mapped = categoryMap.get(catVal.toLowerCase())
          if (mapped) {
            categorySlug = mapped.slug
            categoryName = mapped.name
          } else {
            categorySlug = slugify(catVal)
            categoryName = catVal
            if (!categoryMap.has(categorySlug)) {
              await categoriesCollection.insertOne({
                id: categorySlug,
                name: categoryName,
                slug: categorySlug,
                description: "",
              })
              categoryMap.set(categorySlug, { name: categoryName, slug: categorySlug })
            }
          }
        }
      }

      const slug = slugify(name) + "-" + Date.now().toString(36)
      const brand = brandIdx >= 0 ? String(row[brandIdx] ?? "").trim() || "Genérico" : "Genérico"
      const description = descIdx >= 0 ? String(row[descIdx] ?? "").trim() : ""
      const image = imageIdx >= 0 ? String(row[imageIdx] ?? "").trim() : ""
      const visibleVal = visibleIdx >= 0 ? row[visibleIdx] : undefined
      const visible =
        visibleVal === undefined || visibleVal === null || visibleVal === ""
          ? true
          : String(visibleVal).toLowerCase() === "si" ||
              String(visibleVal).toLowerCase() === "sí" ||
              String(visibleVal).toLowerCase() === "yes" ||
              String(visibleVal) === "1"
      const featured =
        featuredIdx >= 0
          ? String(row[featuredIdx] ?? "").toLowerCase() === "si" ||
            String(row[featuredIdx] ?? "").toLowerCase() === "sí" ||
            String(row[featuredIdx] ?? "").toLowerCase() === "yes" ||
            String(row[featuredIdx]) === "1"
          : false

      try {
        await productsCollection.insertOne({
          name,
          slug,
          brand,
          category: categoryName,
          categorySlug,
          description,
          price,
          image,
          featured,
          inStock: true,
          visible,
          createdAt: new Date(),
        })
        imported++
      } catch (e) {
        errors.push(`Fila ${i + 1} (${name}): ${e instanceof Error ? e.message : "Error"}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Error al importar:", error)
    return NextResponse.json(
      { error: "Error al importar productos" },
      { status: 500 }
    )
  }
}
