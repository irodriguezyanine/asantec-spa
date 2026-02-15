import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

export interface UsuarioAdmin {
  id: string
  nombre: string
  apellido: string
  mail: string
  displayName: string
  cargo: string
  canManageUsers?: boolean
  createdAt?: string
}

function toUsuario(doc: Record<string, unknown>): UsuarioAdmin {
  const nombre = (doc.nombre as string) ?? ""
  const apellido = (doc.apellidoPaterno as string) ?? ""
  const displayName = (doc.displayName as string) ?? ""
  return {
    id: (doc._id as ObjectId).toString(),
    nombre,
    apellido,
    mail: (doc.username as string) ?? "",
    displayName: displayName || [nombre, apellido].filter(Boolean).join(" ") || (doc.username as string),
    cargo: (doc.cargo as string) ?? "Administrador",
    canManageUsers: (doc.canManageUsers as boolean) === true || (doc.username as string) === "jorgeignaciorb@gmail.com",
    createdAt: (doc.createdAt as Date)?.toISOString?.(),
  }
}

function canManageUsers(session: { user?: { email?: string | null; canManageUsers?: boolean } } | null): boolean {
  if (!session?.user) return false
  const u = session.user as { canManageUsers?: boolean; email?: string }
  return u.canManageUsers === true || u.email === "jorgeignaciorb@gmail.com"
}

/**
 * GET: Listar todos los usuarios administradores
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    if (!canManageUsers(session)) {
      return NextResponse.json({ error: "Sin permiso para gestionar usuarios" }, { status: 403 })
    }

    const db = await getDb()
    const docs = await db
      .collection("users")
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: 1 })
      .toArray()

    const usuarios = docs.map((d) => toUsuario(d as Record<string, unknown>))
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error("Error al listar usuarios:", error)
    return NextResponse.json({ error: "Error al cargar usuarios" }, { status: 500 })
  }
}

/**
 * POST: Crear nuevo usuario administrador (solo admins autenticados)
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    if (!canManageUsers(session)) {
      return NextResponse.json({ error: "Sin permiso para gestionar usuarios" }, { status: 403 })
    }

    const body = await request.json()
    const nombre = (body.nombre || "").trim()
    const apellido = (body.apellido || "").trim()
    const mail = (body.mail || "").trim().toLowerCase()
    const password = body.password || ""

    if (!mail) {
      return NextResponse.json({ error: "El correo electrónico es obligatorio" }, { status: 400 })
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const usersCollection = db.collection("users")

    const existing = await usersCollection.findOne({ username: mail })
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese correo electrónico" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const displayName = [nombre, apellido].filter(Boolean).join(" ").trim() || mail

    await usersCollection.insertOne({
      username: mail,
      password: hashedPassword,
      displayName: displayName || mail,
      nombre,
      apellidoPaterno: apellido,
      apellidoMaterno: "",
      rut: "",
      telefono: "",
      cargo: "Administrador",
      role: "admin",
      canManageUsers: false,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Nuevo administrador creado correctamente.",
    })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
