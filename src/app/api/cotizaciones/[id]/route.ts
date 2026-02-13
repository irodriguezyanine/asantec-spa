import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import type { Cotizacion } from "@/types/cotizacion"

function formatCotizacion(doc: Record<string, unknown>): Cotizacion {
  const items = (doc.items as Record<string, unknown>[]) || []
  return {
    id: (doc._id as { toString: () => string }).toString(),
    numero: doc.numero as string,
    fecha: doc.fecha as string,
    cliente: doc.cliente as Cotizacion["cliente"],
    items: items.map((i) => ({
      id: i.id as string,
      cantidad: i.cantidad as number,
      descripcion: i.descripcion as string,
      valorUnit: i.valorUnit as number,
      valorTotal: i.valorTotal as number,
    })),
    totalNeto: doc.totalNeto as number,
    ivaPorcentaje: doc.ivaPorcentaje as number,
    iva: doc.iva as number,
    total: doc.total as number,
    tasaCambio: doc.tasaCambio as string,
    validezDiasHabiles: doc.validezDiasHabiles as number,
    empresa: doc.empresa as Cotizacion["empresa"],
    condicionesDespacho: doc.condicionesDespacho as string,
    referencia: doc.referencia as string,
    mensajeCortesia: doc.mensajeCortesia as string,
    firmaNombre: doc.firmaNombre as string,
    instruccionesOrdenCompra: doc.instruccionesOrdenCompra as string,
    observaciones: doc.observaciones as string,
    condicionVenta: doc.condicionVenta as string,
    createdAt: (doc.createdAt as Date)?.toISOString?.(),
    updatedAt: (doc.updatedAt as Date)?.toISOString?.(),
  }
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
    const doc = await db.collection("cotizaciones").findOne({ _id: new ObjectId(id) })
    if (!doc) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 })
    }

    return NextResponse.json(formatCotizacion(doc as Record<string, unknown>))
  } catch (error) {
    console.error("Error al obtener cotización:", error)
    return NextResponse.json({ error: "Error al cargar cotización" }, { status: 500 })
  }
}

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
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const db = await getDb()
    const collection = db.collection("cotizaciones")

    const items = (body.items || []).map((i: { id?: string; cantidad: number; descripcion: string; valorUnit: number }) => ({
      id: i.id || crypto.randomUUID(),
      cantidad: Number(i.cantidad) || 1,
      descripcion: i.descripcion || "",
      valorUnit: Number(i.valorUnit) || 0,
      valorTotal: (Number(i.cantidad) || 1) * (Number(i.valorUnit) || 0),
    }))

    const totalNeto = items.reduce((s: number, i: { valorTotal: number }) => s + i.valorTotal, 0)
    const ivaPorcentaje = Number(body.ivaPorcentaje) ?? 19
    const iva = Math.round(totalNeto * (ivaPorcentaje / 100))
    const total = totalNeto + iva

    const update: Record<string, unknown> = {
      numero: body.numero,
      fecha: body.fecha,
      cliente: body.cliente,
      items,
      totalNeto,
      ivaPorcentaje,
      iva,
      total,
      tasaCambio: body.tasaCambio,
      validezDiasHabiles: body.validezDiasHabiles,
      empresa: body.empresa,
      condicionesDespacho: body.condicionesDespacho,
      referencia: body.referencia,
      mensajeCortesia: body.mensajeCortesia,
      firmaNombre: body.firmaNombre,
      instruccionesOrdenCompra: body.instruccionesOrdenCompra,
      observaciones: body.observaciones,
      condicionVenta: body.condicionVenta,
      updatedAt: new Date(),
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    )

    if (!result) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 })
    }

    return NextResponse.json(formatCotizacion(result as Record<string, unknown>))
  } catch (error) {
    console.error("Error al actualizar cotización:", error)
    return NextResponse.json({ error: "Error al actualizar cotización" }, { status: 500 })
  }
}

export async function DELETE(
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
    const result = await db.collection("cotizaciones").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar cotización:", error)
    return NextResponse.json({ error: "Error al eliminar cotización" }, { status: 500 })
  }
}
