import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"

export interface CotizacionItemSnapshot {
  cantidad: number
  descripcion: string
  valorUnit: number
}

export interface CotizacionDescarga {
  id: string
  cotizacionId: string
  fechaDescarga: string
  items: CotizacionItemSnapshot[]
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const docs = await db
      .collection("cotizacion_descargas")
      .find({ cotizacionId: id })
      .sort({ fechaDescarga: -1 })
      .toArray()

    const descargas: CotizacionDescarga[] = docs.map((d) => {
      const snapshot = d.cotizacionSnapshot as { items?: { cantidad: number; descripcion: string; valorUnit: number }[] } | null
      const items = (snapshot?.items || []).map((i) => ({
        cantidad: i.cantidad ?? 0,
        descripcion: i.descripcion ?? "",
        valorUnit: i.valorUnit ?? 0,
      }))
      return {
        id: (d._id as { toString: () => string }).toString(),
        cotizacionId: d.cotizacionId as string,
        fechaDescarga: (d.fechaDescarga as Date)?.toISOString?.() ?? "",
        items,
      }
    })

    return NextResponse.json(descargas)
  } catch (error) {
    console.error("Error al listar descargas:", error)
    return NextResponse.json({ error: "Error al cargar descargas" }, { status: 500 })
  }
}
