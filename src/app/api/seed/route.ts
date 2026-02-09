import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/db"
import { categories, products } from "@/data/products"

const ADMIN_USER = "jorgeignaciorb@gmail.com"
const ADMIN_PASSWORD = "Patan123"

/**
 * Migra productos, categorías y crea el usuario administrador en MongoDB.
 * Ejecuta una vez: GET /api/seed (o POST)
 */
export async function GET() {
  return seed()
}

export async function POST() {
  return seed()
}

async function seed() {
  try {
    const db = await getDb()

    const usersCollection = db.collection("users")
    const existingAdmin = await usersCollection.findOne({ username: ADMIN_USER })
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)
      await usersCollection.insertOne({
        username: ADMIN_USER,
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
      })
    }

    const catsCollection = db.collection("categories")
    const existingCats = await catsCollection.countDocuments()
    if (existingCats === 0) {
      await catsCollection.insertMany(
        categories.map((c) => ({
          ...c,
          _id: undefined,
        }))
      )
    }

    const productsCollection = db.collection("products")
    const existingProducts = await productsCollection.countDocuments()
    if (existingProducts === 0) {
      await productsCollection.insertMany(
        products.map((p) => ({
          name: p.name,
          slug: p.slug,
          brand: p.brand,
          category: p.category,
          categorySlug: p.categorySlug,
          description: p.description,
          price: p.price,
          image: p.image || "",
          featured: p.featured ?? false,
          inStock: p.inStock !== false,
          createdAt: new Date(),
        }))
      )
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos inicializada. Usuario admin, categorías y productos migrados.",
    })
  } catch (error) {
    console.error("Error al ejecutar seed:", error)
    return NextResponse.json(
      { error: "Error al inicializar la base de datos" },
      { status: 500 }
    )
  }
}
