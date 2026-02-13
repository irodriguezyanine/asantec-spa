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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const collection = db.collection("cotizaciones")
    const docs = await collection.find({}).sort({ createdAt: -1 }).toArray()
    const cotizaciones = docs.map((d) => formatCotizacion(d as Record<string, unknown>))
    return NextResponse.json(cotizaciones)
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error)
    return NextResponse.json({ error: "Error al cargar cotizaciones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDb()
    const collection = db.collection("cotizaciones")

    const lastDoc = await collection.find({}).sort({ numero: -1 }).limit(1).toArray()
    const lastNum = lastDoc[0] ? parseInt((lastDoc[0] as { numero?: string }).numero || "0", 10) : 0
    const numero = String(lastNum + 1).padStart(5, "0")

    const hoy = new Date().toISOString().slice(0, 10)
    const fecha = body.fecha || hoy

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

    const doc = {
      numero,
      fecha,
      cliente: body.cliente || {
        empresa: "",
        rut: "",
        contacto: "",
        mail: "",
        fono: "",
      },
      items,
      totalNeto,
      ivaPorcentaje,
      iva,
      total,
      tasaCambio: body.tasaCambio ?? "US$-",
      validezDiasHabiles: body.validezDiasHabiles ?? 2,
      empresa: body.empresa || {
        nombre: "ASANTEC SPA",
        rut: "77.049.610-1",
        direccion: "Av. Francisco Bilbao N°3771 Oficina 402, Providencia",
        contacto: "Jorge Rodriguez Bonilla",
        mail: "jorge.rodriguez@asantec.cl",
        fono: "+569 9866 1395",
      },
      condicionesDespacho: body.condicionesDespacho ?? "",
      referencia: body.referencia ?? "Solicitud vía email",
      mensajeCortesia: body.mensajeCortesia ?? "",
      firmaNombre: body.firmaNombre ?? "Jorge Rodriguez Bonilla",
      instruccionesOrdenCompra: body.instruccionesOrdenCompra ?? "",
      observaciones: body.observaciones ?? "",
      condicionVenta: body.condicionVenta ?? "CONTADO",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(doc)
    const inserted = await collection.findOne({ _id: result.insertedId })
    return NextResponse.json(formatCotizacion(inserted as Record<string, unknown>), { status: 201 })
  } catch (error) {
    console.error("Error al crear cotización:", error)
    return NextResponse.json({ error: "Error al crear cotización" }, { status: 500 })
  }
}
