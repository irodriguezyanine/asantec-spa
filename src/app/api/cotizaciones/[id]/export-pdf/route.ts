import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import { renderToBuffer } from "@react-pdf/renderer"
import { CotizacionPdfDocument } from "@/components/cotizacion/CotizacionPdfDocument"
import React from "react"
import path from "path"
import fs from "fs"
import type { Cotizacion } from "@/types/cotizacion"

function loadLogosAsBase64(): Record<string, string> {
  const logosDir = path.join(process.cwd(), "public", "logos")
  const logos: Record<string, string> = {}
  const files = [
    { key: "asantec", name: "asantec.png" },
    { key: "senegocia", name: "senegocia.png" },
    { key: "iconstruye", name: "iconstruye.png" },
    { key: "chilecompra", name: "chilecompra.png" },
    { key: "chileproveedores", name: "chileproveedores.png" },
  ]
  for (const { key, name } of files) {
    const filePath = path.join(logosDir, name)
    try {
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath)
        logos[key] = `data:image/png;base64,${buffer.toString("base64")}`
      }
    } catch {
      // Ignorar si no existe
    }
  }
  return logos
}

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
    const logos = loadLogosAsBase64()
    const pdfDoc = React.createElement(CotizacionPdfDocument, {
      cotizacion,
      logos,
    })
    // CotizacionPdfDocument retorna <Document>; assertion para compatibilidad con tipos de @react-pdf
    const buffer = await renderToBuffer(pdfDoc as Parameters<typeof renderToBuffer>[0])

    const [y, m, d] = (cotizacion.fecha || "").split("-")
    const fechaPart = y && m && d ? `${y.slice(-2)}${m}${d}` : "000000"
    const empresaPart = (cotizacion.cliente?.empresa || "").trim()
    const contactoPart = (cotizacion.cliente?.contacto || "").trim()
    const suffix = [empresaPart, contactoPart].filter(Boolean).join(" ") || "Cliente"
    const filename = `${fechaPart} Cotización Asantec SPA para ${suffix}.pdf`

    // Uint8Array para compatibilidad con BodyInit en NextResponse (Buffer no es BodyInit en tipos)
    const body = new Uint8Array(buffer)
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(body.length),
      },
    })
  } catch (error) {
    console.error("Error al exportar PDF:", error)
    return NextResponse.json({ error: "Error al generar PDF" }, { status: 500 })
  }
}
