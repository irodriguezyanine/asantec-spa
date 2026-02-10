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
    return NextResponse.json({ hidePrices })
  } catch (error) {
    console.error("Error al obtener settings:", error)
    return NextResponse.json({ hidePrices: false })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const hidePrices = body.hidePrices === true

    const db = await getDb()
    await db.collection("settings").updateOne(
      { key: SETTINGS_KEY },
      { $set: { hidePrices, updatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ hidePrices })
  } catch (error) {
    console.error("Error al actualizar settings:", error)
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
  }
}
