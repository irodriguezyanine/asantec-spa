import { NextResponse } from "next/server"

/**
 * La creación de usuarios está deshabilitada.
 * El administrador se crea mediante el seed: GET /api/seed
 */
export async function POST() {
  return NextResponse.json(
    { error: "No se permiten nuevos registros" },
    { status: 403 }
  )
}
