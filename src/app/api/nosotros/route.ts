import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import type { NosotrosContent } from "@/types/nosotros"
import { NOSOTROS_DEFAULTS } from "@/types/nosotros"

const NOSOTROS_KEY = "main"

async function getContent(): Promise<NosotrosContent> {
  const db = await getDb()
  const doc = await db.collection("nosotros").findOne({ key: NOSOTROS_KEY })
  if (!doc) return NOSOTROS_DEFAULTS
  const { key: _k, ...rest } = doc as Record<string, unknown>
  return { ...NOSOTROS_DEFAULTS, ...rest } as NosotrosContent
}

export async function GET() {
  try {
    const content = await getContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error("Error al obtener Nosotros:", error)
    return NextResponse.json(NOSOTROS_DEFAULTS)
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDb()

    const content: NosotrosContent = {
      heroTitle: body.heroTitle ?? NOSOTROS_DEFAULTS.heroTitle,
      heroSubtitle: body.heroSubtitle ?? NOSOTROS_DEFAULTS.heroSubtitle,
      asantecTitle: body.asantecTitle ?? NOSOTROS_DEFAULTS.asantecTitle,
      asantecP1: body.asantecP1 ?? NOSOTROS_DEFAULTS.asantecP1,
      asantecP2: body.asantecP2 ?? NOSOTROS_DEFAULTS.asantecP2,
      institucionesTitle: body.institucionesTitle ?? NOSOTROS_DEFAULTS.institucionesTitle,
      institucionesP: body.institucionesP ?? NOSOTROS_DEFAULTS.institucionesP,
      institucionesTags: Array.isArray(body.institucionesTags)
        ? body.institucionesTags
        : NOSOTROS_DEFAULTS.institucionesTags,
      planifiqueTitle: body.planifiqueTitle ?? NOSOTROS_DEFAULTS.planifiqueTitle,
      planifiqueP1: body.planifiqueP1 ?? NOSOTROS_DEFAULTS.planifiqueP1,
      planifiqueP2: body.planifiqueP2 ?? NOSOTROS_DEFAULTS.planifiqueP2,
      contactoTitle: body.contactoTitle ?? NOSOTROS_DEFAULTS.contactoTitle,
      contactoP: body.contactoP ?? NOSOTROS_DEFAULTS.contactoP,
      telefono1: body.telefono1 ?? NOSOTROS_DEFAULTS.telefono1,
      telefono2: body.telefono2 ?? NOSOTROS_DEFAULTS.telefono2,
      cierreTexto: body.cierreTexto ?? NOSOTROS_DEFAULTS.cierreTexto,
      cierreEmpresa: body.cierreEmpresa ?? NOSOTROS_DEFAULTS.cierreEmpresa,
      cierreDireccion: body.cierreDireccion ?? NOSOTROS_DEFAULTS.cierreDireccion,
      cierreTelefono: body.cierreTelefono ?? NOSOTROS_DEFAULTS.cierreTelefono,
      cierreEmail: body.cierreEmail ?? NOSOTROS_DEFAULTS.cierreEmail,
      gerenteTitle: body.gerenteTitle ?? NOSOTROS_DEFAULTS.gerenteTitle,
      gerenteNombre: body.gerenteNombre ?? NOSOTROS_DEFAULTS.gerenteNombre,
      gerenteCargo: body.gerenteCargo ?? NOSOTROS_DEFAULTS.gerenteCargo,
      gerenteDescripcion: body.gerenteDescripcion ?? NOSOTROS_DEFAULTS.gerenteDescripcion,
      gerenteImagen: body.gerenteImagen ?? NOSOTROS_DEFAULTS.gerenteImagen,
      gerenteFrase: body.gerenteFrase ?? NOSOTROS_DEFAULTS.gerenteFrase,
    }

    await db.collection("nosotros").updateOne(
      { key: NOSOTROS_KEY },
      { $set: { ...content, key: NOSOTROS_KEY, updatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json(content)
  } catch (error) {
    console.error("Error al guardar Nosotros:", error)
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}
