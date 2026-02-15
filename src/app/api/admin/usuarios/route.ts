import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"

/**
 * POST: Crear nuevo usuario administrador (solo admins autenticados)
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
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
