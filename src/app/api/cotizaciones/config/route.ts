import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { COTIZACION_DEFAULTS } from "@/types/cotizacion"
import { EMPRESA_DEFAULT } from "@/types/cotizacion"

const CONFIG_KEY = "cotizacion"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const doc = await db.collection("settings").findOne({ key: CONFIG_KEY })

    const defaults = {
      condicionesDespacho: COTIZACION_DEFAULTS.condicionesDespacho,
      referencia: COTIZACION_DEFAULTS.referencia,
      mensajeCortesia: COTIZACION_DEFAULTS.mensajeCortesia,
      firmaNombre: COTIZACION_DEFAULTS.firmaNombre,
      empresaContacto: EMPRESA_DEFAULT.contacto,
      empresaMail: EMPRESA_DEFAULT.mail,
      empresaFono: EMPRESA_DEFAULT.fono,
      instruccionesOrdenCompra: COTIZACION_DEFAULTS.instruccionesOrdenCompra,
      observaciones: COTIZACION_DEFAULTS.observaciones,
      condicionVenta: COTIZACION_DEFAULTS.condicionVenta,
    }

    if (!doc) {
      return NextResponse.json(defaults)
    }

    return NextResponse.json({
      condicionesDespacho: doc.condicionesDespacho ?? defaults.condicionesDespacho,
      referencia: doc.referencia ?? defaults.referencia,
      mensajeCortesia: doc.mensajeCortesia ?? defaults.mensajeCortesia,
      firmaNombre: doc.firmaNombre ?? defaults.firmaNombre,
      empresaContacto: doc.empresaContacto ?? defaults.empresaContacto,
      empresaMail: doc.empresaMail ?? defaults.empresaMail,
      empresaFono: doc.empresaFono ?? defaults.empresaFono,
      instruccionesOrdenCompra: doc.instruccionesOrdenCompra ?? defaults.instruccionesOrdenCompra,
      observaciones: doc.observaciones ?? defaults.observaciones,
      condicionVenta: doc.condicionVenta ?? defaults.condicionVenta,
    })
  } catch (error) {
    console.error("Error al obtener config cotización:", error)
    return NextResponse.json({ error: "Error al cargar configuración" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    const fields = [
      "condicionesDespacho",
      "referencia",
      "mensajeCortesia",
      "firmaNombre",
      "empresaContacto",
      "empresaMail",
      "empresaFono",
      "instruccionesOrdenCompra",
      "observaciones",
      "condicionVenta",
    ]

    for (const f of fields) {
      if (typeof body[f] === "string") updates[f] = body[f]
    }

    const db = await getDb()
    await db.collection("settings").updateOne(
      { key: CONFIG_KEY },
      { $set: updates },
      { upsert: true }
    )

    const doc = await db.collection("settings").findOne({ key: CONFIG_KEY })
    const defaults = {
      condicionesDespacho: COTIZACION_DEFAULTS.condicionesDespacho,
      referencia: COTIZACION_DEFAULTS.referencia,
      mensajeCortesia: COTIZACION_DEFAULTS.mensajeCortesia,
      firmaNombre: COTIZACION_DEFAULTS.firmaNombre,
      empresaContacto: EMPRESA_DEFAULT.contacto,
      empresaMail: EMPRESA_DEFAULT.mail,
      empresaFono: EMPRESA_DEFAULT.fono,
      instruccionesOrdenCompra: COTIZACION_DEFAULTS.instruccionesOrdenCompra,
      observaciones: COTIZACION_DEFAULTS.observaciones,
      condicionVenta: COTIZACION_DEFAULTS.condicionVenta,
    }

    return NextResponse.json({
      condicionesDespacho: doc?.condicionesDespacho ?? defaults.condicionesDespacho,
      referencia: doc?.referencia ?? defaults.referencia,
      mensajeCortesia: doc?.mensajeCortesia ?? defaults.mensajeCortesia,
      firmaNombre: doc?.firmaNombre ?? defaults.firmaNombre,
      empresaContacto: doc?.empresaContacto ?? defaults.empresaContacto,
      empresaMail: doc?.empresaMail ?? defaults.empresaMail,
      empresaFono: doc?.empresaFono ?? defaults.empresaFono,
      instruccionesOrdenCompra: doc?.instruccionesOrdenCompra ?? defaults.instruccionesOrdenCompra,
      observaciones: doc?.observaciones ?? defaults.observaciones,
      condicionVenta: doc?.condicionVenta ?? defaults.condicionVenta,
    })
  } catch (error) {
    console.error("Error al actualizar config cotización:", error)
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 })
  }
}
