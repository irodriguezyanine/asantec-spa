import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export interface UserProfile {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  rut: string
  mail: string
  telefono: string
  cargo: string
}

function toProfile(doc: Record<string, unknown>): UserProfile {
  let nombre = (doc.nombre as string) ?? ""
  let apellidoPaterno = (doc.apellidoPaterno as string) ?? ""
  const apellidoMaterno = (doc.apellidoMaterno as string) ?? ""
  if (!nombre && !apellidoPaterno) {
    const dn = (doc.displayName as string) ?? ""
    const parts = dn.trim().split(/\s+/)
    if (parts.length >= 1) nombre = parts[0]
    if (parts.length >= 2) apellidoPaterno = parts[1]
  }
  return {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    rut: (doc.rut as string) ?? "",
    mail: (doc.username as string) ?? "",
    telefono: (doc.telefono as string) ?? "",
    cargo: (doc.cargo as string) ?? "",
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) })
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(toProfile(user as Record<string, unknown>))
  } catch (error) {
    console.error("Error al obtener perfil:", error)
    return NextResponse.json({ error: "Error al cargar perfil" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDb()
    const userId = new ObjectId(session.user.id)

    const update: Record<string, unknown> = {
      nombre: body.nombre ?? "",
      apellidoPaterno: body.apellidoPaterno ?? "",
      apellidoMaterno: body.apellidoMaterno ?? "",
      rut: body.rut ?? "",
      telefono: body.telefono ?? "",
      cargo: body.cargo ?? "",
      updatedAt: new Date(),
    }

    if (body.mail?.trim()) {
      update.username = body.mail.trim()
    }

    if (body.nuevaClave?.trim()) {
      if (!body.claveActual?.trim()) {
        return NextResponse.json(
          { error: "Debe ingresar la contraseña actual para cambiarla" },
          { status: 400 }
        )
      }
      const user = await db.collection("users").findOne({ _id: userId })
      if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
      }
      const valid = await bcrypt.compare(body.claveActual, user.password)
      if (!valid) {
        return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 })
      }
      update.password = await bcrypt.hash(body.nuevaClave, 12)
    }

    const displayName = [body.nombre, body.apellidoPaterno, body.apellidoMaterno]
      .filter(Boolean)
      .join(" ")
      .trim()
    if (displayName) update.displayName = displayName

    await db.collection("users").updateOne({ _id: userId }, { $set: update })

    const updated = await db.collection("users").findOne({ _id: userId })
    return NextResponse.json(toProfile(updated as Record<string, unknown>))
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    return NextResponse.json({ error: "Error al guardar perfil" }, { status: 500 })
  }
}
