import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import type { Contacto } from "@/types/cliente"

function formatContacto(doc: Record<string, unknown>): Contacto {
  return {
    id: (doc._id as { toString: () => string }).toString(),
    empresaId: (doc.empresaId as ObjectId).toString(),
    nombre: doc.nombre as string,
    email: doc.email as string,
    telefono: doc.telefono as string,
    createdAt: (doc.createdAt as Date)?.toISOString?.(),
    updatedAt: (doc.updatedAt as Date)?.toISOString?.(),
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const empresaId = searchParams.get("empresaId")

    if (!empresaId) {
      return NextResponse.json([])
    }

    const db = await getDb()
    const contactosMap = new Map<string, Contacto>()

    if (empresaId.startsWith("cot-")) {
      const parts = empresaId.replace("cot-", "").split("::")
      const nombre = parts[0] || ""
      const rut = parts[1] || ""
      const query: Record<string, unknown> = {
        "cliente.contacto": { $exists: true, $ne: "", $regex: /./ },
      }
      if (nombre) {
        query["cliente.empresa"] = { $regex: new RegExp(`^${nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }
      }
      if (rut) {
        query["cliente.rut"] = { $regex: new RegExp(`^${rut.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }
      }
      const cotizaciones = await db.collection("cotizaciones").find(query).toArray()

      for (const c of cotizaciones) {
        const doc = c as Record<string, unknown>
        const cliente = doc.cliente as { contacto?: string; mail?: string; fono?: string }
        if (cliente?.contacto?.trim()) {
          const k = (cliente.contacto || "").trim()
          if (!contactosMap.has(k)) {
            contactosMap.set(k, {
              id: `cot-${k}`,
              empresaId,
              nombre: (cliente.contacto || "").trim(),
              email: cliente.mail || "",
              telefono: cliente.fono || "",
            })
          }
        }
      }
    } else if (ObjectId.isValid(empresaId)) {
      const docs = await db
        .collection("contactos")
        .find({ empresaId: new ObjectId(empresaId) })
        .sort({ nombre: 1 })
        .toArray()

      for (const d of docs) {
        const doc = d as Record<string, unknown>
        contactosMap.set((doc.nombre as string) || "", formatContacto(doc))
      }
    }

    const contactos = Array.from(contactosMap.values())
    return NextResponse.json(contactos)
  } catch (error) {
    console.error("Error al obtener contactos:", error)
    return NextResponse.json({ error: "Error al obtener contactos" }, { status: 500 })
  }
}
