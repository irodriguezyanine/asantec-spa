import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/db"

/**
 * Registra el primer usuario administrador.
 * Solo funciona cuando no existe ningún usuario en la base de datos.
 */
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({})
    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe un usuario. Usa el login normal." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await usersCollection.insertOne({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, message: "Usuario administrador creado" })
  } catch (error) {
    console.error("Error al registrar:", error)
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    )
  }
}
