import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { upsertEmpresa, upsertContacto } from "@/lib/clientes"

/**
 * Migra datos de cotizaciones existentes a las colecciones empresas y contactos.
 * Ejecutar una vez para poblar el historial de clientes.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const cotizaciones = await db
      .collection("cotizaciones")
      .find({})
      .toArray()

    let empresasCreadas = 0
    let contactosCreados = 0

    for (const doc of cotizaciones) {
      const cliente = doc.cliente as { empresa?: string; rut?: string; contacto?: string; mail?: string; fono?: string } | undefined
      if (!cliente?.empresa?.trim() && !cliente?.rut?.trim()) continue

      try {
        const empresaId = await upsertEmpresa(
          cliente.empresa || "",
          cliente.rut || ""
        )
        empresasCreadas++

        if (cliente.contacto?.trim()) {
          await upsertContacto(
            empresaId,
            cliente.contacto || "",
            cliente.mail || "",
            cliente.fono || ""
          )
          contactosCreados++
        }
      } catch (err) {
        console.error("Error migrando cotización:", doc._id, err)
      }
    }

    return NextResponse.json({
      success: true,
      cotizacionesProcesadas: cotizaciones.length,
      empresasCreadas,
      contactosCreados,
    })
  } catch (error) {
    console.error("Error en migración:", error)
    return NextResponse.json(
      { error: "Error al migrar datos" },
      { status: 500 }
    )
  }
}
