import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

function canManageUsers(session: { user?: { email?: string | null; canManageUsers?: boolean } } | null): boolean {
  if (!session?.user) return false
  const u = session.user as { canManageUsers?: boolean; email?: string }
  return u.canManageUsers === true || u.email === "jorgeignaciorb@gmail.com"
}

/**
 * PUT: Actualizar usuario
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    if (!canManageUsers(session)) {
      return NextResponse.json({ error: "Sin permiso para gestionar usuarios" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const db = await getDb()
    const userId = new ObjectId(id)

    const update: Record<string, unknown> = {
      nombre: (body.nombre || "").trim(),
      apellidoPaterno: (body.apellido || "").trim(),
      cargo: (body.cargo || "").trim() || "Administrador",
      updatedAt: new Date(),
    }
    const existingUser = await db.collection("users").findOne({ _id: userId }) as { username?: string } | null
    if (typeof body.canManageUsers === "boolean" && existingUser?.username !== "jorgeignaciorb@gmail.com") {
      update.canManageUsers = body.canManageUsers
    }

    if (body.mail?.trim()) {
      const mail = body.mail.trim().toLowerCase()
      const existing = await db.collection("users").findOne({
        username: mail,
        _id: { $ne: userId },
      })
      if (existing) {
        return NextResponse.json(
          { error: "Ya existe otro usuario con ese correo electrónico" },
          { status: 400 }
        )
      }
      update.username = mail
    }

    const displayName = [body.nombre, body.apellido]
      .filter(Boolean)
      .map((s: string) => (s || "").trim())
      .join(" ")
      .trim()
    if (displayName) update.displayName = displayName

    if (body.password?.trim() && body.password.length >= 6) {
      update.password = await bcrypt.hash(body.password, 12)
    }

    await db.collection("users").updateOne({ _id: userId }, { $set: update })

    const updated = await db.collection("users").findOne(
      { _id: userId },
      { projection: { password: 0 } }
    )
    if (!updated) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const doc = updated as Record<string, unknown>
    return NextResponse.json({
      id: doc._id?.toString(),
      nombre: doc.nombre,
      apellido: doc.apellidoPaterno,
      mail: doc.username,
      displayName: doc.displayName,
      cargo: doc.cargo,
      canManageUsers: doc.canManageUsers === true || doc.username === "jorgeignaciorb@gmail.com",
    })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}
