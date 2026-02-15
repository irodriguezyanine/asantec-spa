import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { upsertEmpresa, upsertContacto } from "@/lib/clientes"
import { ObjectId } from "mongodb"

export interface ClienteAgregado {
  id: string
  empresa: string
  rut: string
  contacto: string
  mail: string
  fono: string
  ultimaCotizacionId: string
  ultimaCotizacionFecha: string
  ultimaCotizacionNumero: string
  totalCotizaciones: number
}

/**
 * GET: Lista clientes agregados desde cotizaciones (empresa+rut como clave única)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const cotizaciones = await db
      .collection("cotizaciones")
      .find({})
      .sort({ fecha: -1, createdAt: -1 })
      .toArray()

    const map = new Map<string, ClienteAgregado>()
    for (const doc of cotizaciones) {
      const d = doc as Record<string, unknown>
      const cliente = d.cliente as { empresa?: string; rut?: string; contacto?: string; mail?: string; fono?: string } | undefined
      if (!cliente?.empresa?.trim() && !cliente?.rut?.trim()) continue

      const empresa = (cliente.empresa || "").trim()
      const rut = (cliente.rut || "").trim()
      const key = `${empresa}::${rut}`

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          empresa,
          rut,
          contacto: (cliente.contacto || "").trim(),
          mail: (cliente.mail || "").trim(),
          fono: (cliente.fono || "").trim(),
          ultimaCotizacionId: (d._id as ObjectId).toString(),
          ultimaCotizacionFecha: (d.fecha as string) || "",
          ultimaCotizacionNumero: (d.numero as string) || "",
          totalCotizaciones: 1,
        })
      } else {
        const existing = map.get(key)!
        existing.totalCotizaciones += 1
      }
    }

    const clientes = Array.from(map.values()).sort((a, b) =>
      b.ultimaCotizacionFecha.localeCompare(a.ultimaCotizacionFecha)
    )
    return NextResponse.json(clientes)
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    return NextResponse.json({ error: "Error al cargar clientes" }, { status: 500 })
  }
}

/**
 * POST: Agregar nuevo cliente (empresa + contacto) a la base empresas/contactos
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const empresa = (body.empresa || "").trim()
    const rut = (body.rut || "").trim()
    const contacto = (body.contacto || "").trim()
    const mail = (body.mail || "").trim()
    const fono = (body.fono || "").trim()

    if (!empresa) {
      return NextResponse.json({ error: "El nombre de empresa es obligatorio" }, { status: 400 })
    }

    const empresaId = await upsertEmpresa(empresa, rut)
    if (contacto) {
      await upsertContacto(empresaId, contacto, mail, fono)
    }

    return NextResponse.json({
      success: true,
      message: "Cliente agregado correctamente. Aparecerá al crear cotizaciones.",
    })
  } catch (error) {
    console.error("Error al agregar cliente:", error)
    return NextResponse.json({ error: "Error al agregar cliente" }, { status: 500 })
  }
}
