import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"

const SETTINGS_KEY = "site"

export async function GET() {
  try {
    const db = await getDb()
    const doc = await db.collection("settings").findOne({ key: SETTINGS_KEY })
    const hidePrices = doc?.hidePrices === true
    const seoTitle = doc?.seoTitle ?? null
    const seoDescription = doc?.seoDescription ?? null
    const seoKeywords = Array.isArray(doc?.seoKeywords) ? doc.seoKeywords : null
    return NextResponse.json({
      hidePrices,
      seoTitle,
      seoDescription,
      seoKeywords,
    })
  } catch (error) {
    console.error("Error al obtener settings:", error)
    return NextResponse.json({ hidePrices: false, seoTitle: null, seoDescription: null, seoKeywords: null })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const updates: Record<string, unknown> = { updatedAt: new Date() }

    if (typeof body.hidePrices === "boolean") updates.hidePrices = body.hidePrices
    if (typeof body.seoTitle === "string") updates.seoTitle = body.seoTitle
    if (typeof body.seoDescription === "string") updates.seoDescription = body.seoDescription
    if (Array.isArray(body.seoKeywords)) {
      updates.seoKeywords = body.seoKeywords.filter((k: unknown) => typeof k === "string")
    }

    const db = await getDb()
    await db.collection("settings").updateOne(
      { key: SETTINGS_KEY },
      { $set: updates },
      { upsert: true }
    )

    const doc = await db.collection("settings").findOne({ key: SETTINGS_KEY })
    return NextResponse.json({
      hidePrices: doc?.hidePrices === true,
      seoTitle: doc?.seoTitle ?? null,
      seoDescription: doc?.seoDescription ?? null,
      seoKeywords: Array.isArray(doc?.seoKeywords) ? doc.seoKeywords : null,
    })
  } catch (error) {
    console.error("Error al actualizar settings:", error)
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
  }
}
