import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"

interface VisitByDayDoc {
  _id: string
  count: number
}

interface TopProductDoc {
  _id: string | null
  productName?: string
  slug?: string
  count: number
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Visitas por día (últimos 30 días): solo page_view
    const visitsByDay = (await db
      .collection("events")
      .aggregate<VisitByDayDoc>([
        { $match: { type: "page_view", createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray()) as VisitByDayDoc[]

    // Top 5 productos más clickeados
    const topProducts = (await db
      .collection("events")
      .aggregate<TopProductDoc>([
        { $match: { type: "product_click" } },
        {
          $group: {
            _id: "$productId",
            productName: { $first: "$productName" },
            slug: { $first: "$slug" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray()) as TopProductDoc[]

    const visitsByDayFormatted = visitsByDay.map((d) => ({
      date: d._id,
      visitas: d.count,
    }))

    const topProductsFormatted = topProducts.map((p) => ({
      productId: p._id,
      productName: p.productName ?? "Sin nombre",
      slug: p.slug ?? "",
      count: p.count,
    }))

    return NextResponse.json({
      visitsByDay: visitsByDayFormatted,
      topProducts: topProductsFormatted,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
