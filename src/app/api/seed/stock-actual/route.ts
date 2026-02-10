import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

const STOCK_ACTUAL_PRODUCTS = [
  { name: "NUC INTEL I7 NUC10i7FNHN DDR4", price: 480000, brand: "Intel" },
  { name: "Desktop Dell OptiPlex 7070 SFF, i7-9700", price: 560000, brand: "Dell" },
  { name: "Z390-P PRIME ASUS", price: 120000, brand: "ASUS" },
  { name: "X570-P PRIME ASUS", price: 150000, brand: "ASUS" },
  { name: "B460M-A PRIME A R2.0 ASUS", price: 100000, brand: "ASUS" },
  { name: "MSI MAG Z490 TOMAHAWK", price: 180000, brand: "MSI" },
  { name: "MSI Z370 GAMING PLUS", price: 120000, brand: "MSI" },
  { name: "ASUS Z390-PLUS TUF GAMING WI-FI", price: 170000, brand: "ASUS" },
  { name: "MSI NVIDIA GEFORCE GT 710 1GB", price: 35000, brand: "MSI" },
  { name: "ASROCK PHANTOM GAMING RX 550", price: 130000, brand: "ASRock" },
  { name: "ASUS GEFORCE GT1030 2GB", price: 90000, brand: "ASUS" },
  { name: "EVGA NVIDIA GEFORCE 210", price: 25000, brand: "EVGA" },
  { name: "INTEL I5-9.600K", price: 250000, brand: "Intel" },
  { name: "INTEL I3-9.100", price: 95000, brand: "Intel" },
  { name: "PENTIUM GOLD", price: 70000, brand: "Intel" },
  { name: "KINGSTON FURY RENEGADE RGB", price: 24000, brand: "Kingston" },
  { name: "Kingston 8 GB DDR4 2666 MHz DIMM", price: 30000, brand: "Kingston" },
]

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const categoriesCollection = db.collection("categories")
    const productsCollection = db.collection("products")

    const categorySlug = "stock-actual"
    let cat = await categoriesCollection.findOne({ slug: categorySlug })
    if (!cat) {
      await categoriesCollection.insertOne({
        id: categorySlug,
        name: "STOCK ACTUAL",
        slug: categorySlug,
        description: "Inventario actual. Todo sellado sin uso.",
        visible: true,
        parentId: null,
      })
      cat = await categoriesCollection.findOne({ slug: categorySlug })
    }

    let imported = 0
    for (let i = 0; i < STOCK_ACTUAL_PRODUCTS.length; i++) {
      const p = STOCK_ACTUAL_PRODUCTS[i]
      const slug = slugify(p.name) + "-" + Date.now().toString(36) + "-" + i
      const existing = await productsCollection.findOne({ name: p.name, categorySlug })
      if (existing) continue

      await productsCollection.insertOne({
        name: p.name,
        slug,
        brand: p.brand || "Genérico",
        category: "STOCK ACTUAL",
        categorySlug,
        description: "Producto en stock. Todo sellado sin uso.",
        price: p.price,
        image: "",
        featured: false,
        inStock: true,
        visible: true,
        showPublicPrice: true,
        createdAt: new Date(),
      })
      imported++
    }

    return NextResponse.json({
      success: true,
      message: `Categoría STOCK ACTUAL creada/verificada. ${imported} productos agregados.`,
      imported,
    })
  } catch (error) {
    console.error("Error al cargar STOCK ACTUAL:", error)
    return NextResponse.json(
      { error: "Error al cargar STOCK ACTUAL", detail: error instanceof Error ? error.message : "Desconocido" },
      { status: 500 }
    )
  }
}
