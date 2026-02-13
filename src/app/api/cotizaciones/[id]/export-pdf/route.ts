import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import { renderToBuffer } from "@react-pdf/renderer"
import { CotizacionPdfDocument } from "@/components/cotizacion/CotizacionPdfDocument"
import React from "react"
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

    const cotizacion = formatCotizacion(doc as Record<string, unknown>)
    const pdfDoc = React.createElement(CotizacionPdfDocument, { cotizacion })
    // CotizacionPdfDocument retorna <Document>; assertion para compatibilidad con tipos de @react-pdf
    const buffer = await renderToBuffer(pdfDoc as Parameters<typeof renderToBuffer>[0])

    const filename = `Cotizacion-${cotizacion.numero}-${cotizacion.cliente.empresa.replace(/\s+/g, "-")}.pdf`

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    })
  } catch (error) {
    console.error("Error al exportar PDF:", error)
    return NextResponse.json({ error: "Error al generar PDF" }, { status: 500 })
  }
}
