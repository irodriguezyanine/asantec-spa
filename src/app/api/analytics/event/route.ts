import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const type = body.type === "product_click" ? "product_click" : "page_view"
    const path = typeof body.path === "string" ? body.path : undefined
    const productId = typeof body.productId === "string" ? body.productId : undefined
    const productName = typeof body.productName === "string" ? body.productName : undefined
    const slug = typeof body.slug === "string" ? body.slug : undefined

    const db = await getDb()
    await db.collection("events").insertOne({
      type,
      path: path ?? null,
      productId: productId ?? null,
      productName: productName ?? null,
      slug: slug ?? null,
      createdAt: new Date(),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error al registrar evento:", error)
    return NextResponse.json({ error: "Error al registrar evento" }, { status: 500 })
  }
}
