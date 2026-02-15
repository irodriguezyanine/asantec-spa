import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"

/**
 * PUT: Actualizar datos del cliente en todas las cotizaciones que lo referencian
 * id = empresa::rut (ej: "EMPRESA SA::12.345.678-9")
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const decodedId = decodeURIComponent(id)
    const parts = decodedId.split("::")
    const empresaOld = parts[0] || ""
    const rutOld = parts[1] || ""

    const body = await request.json()
    const empresa = (body.empresa || "").trim()
    const rut = (body.rut || "").trim()
    const contacto = (body.contacto || "").trim()
    const mail = (body.mail || "").trim()
    const fono = (body.fono || "").trim()

    if (!empresa) {
      return NextResponse.json({ error: "El nombre de empresa es obligatorio" }, { status: 400 })
    }

    const db = await getDb()
    const collection = db.collection("cotizaciones")

    const query: Record<string, unknown> = {}
    if (empresaOld) query["cliente.empresa"] = { $regex: new RegExp(`^${empresaOld.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }
    if (rutOld) query["cliente.rut"] = { $regex: new RegExp(`^${rutOld.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }

    const result = await collection.updateMany(query, {
      $set: {
        "cliente.empresa": empresa,
        "cliente.rut": rut,
        "cliente.contacto": contacto,
        "cliente.mail": mail,
        "cliente.fono": fono,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: `Cliente actualizado en ${result.modifiedCount} cotización(es).`,
    })
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 })
  }
}
