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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; descargaId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id, descargaId } = await params
    if (!ObjectId.isValid(descargaId)) {
      return NextResponse.json({ error: "ID de descarga inválido" }, { status: 400 })
    }

    const db = await getDb()
    const doc = await db
      .collection("cotizacion_descargas")
      .findOne({ _id: new ObjectId(descargaId), cotizacionId: id })

    if (!doc || !doc.cotizacionSnapshot) {
      return NextResponse.json({ error: "Descarga no encontrada" }, { status: 404 })
    }

    const cotizacion = doc.cotizacionSnapshot as Cotizacion
    const logos = loadLogosAsBase64()
    const pdfDoc = React.createElement(CotizacionPdfDocument, {
      cotizacion,
      logos,
    })
    const buffer = await renderToBuffer(pdfDoc as Parameters<typeof renderToBuffer>[0])

    const [y, m, d] = (cotizacion.fecha || "").split("-")
    const fechaPart = y && m && d ? `${y.slice(-2)}${m}${d}` : "000000"
    const empresaPart = (cotizacion.cliente?.empresa || "").trim()
    const contactoPart = (cotizacion.cliente?.contacto || "").trim()
    const suffix = [empresaPart, contactoPart].filter(Boolean).join(" ") || "Cliente"
    const fechaDescarga = (doc.fechaDescarga as Date)?.toISOString?.()?.slice(0, 19)?.replace(/[T:]/g, "-") ?? ""
    const filename = `${fechaPart} Cotización Asantec SPA para ${suffix} (descargado ${fechaDescarga}).pdf`

    const body = new Uint8Array(buffer)
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(body.length),
      },
    })
  } catch (error) {
    console.error("Error al exportar PDF desde historial:", error)
    return NextResponse.json({ error: "Error al generar PDF" }, { status: 500 })
  }
}
