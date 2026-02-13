import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = (searchParams.get("q") || "").trim().toLowerCase()

    const db = await getDb()
    const collection = db.collection("empresas")

    const empresasMap = new Map<string, { id: string; nombre: string; rut: string }>()

    if (q.length >= 2) {
      const docs = await collection
        .find({
          $or: [
            { nombre: { $regex: q, $options: "i" } },
            { rut: { $regex: q.replace(/[.\s-]/g, ""), $options: "i" } },
            { rut: { $regex: q, $options: "i" } },
          ],
        })
        .sort({ nombre: 1 })
        .limit(15)
        .toArray()

      for (const d of docs) {
        const doc = d as Record<string, unknown>
        const id = (doc._id as { toString: () => string }).toString()
        const nombre = (doc.nombre as string) || ""
        const rut = (doc.rut as string) || ""
        empresasMap.set(`${nombre}-${rut}`, { id, nombre, rut })
      }

      const cotizaciones = await db
        .collection("cotizaciones")
        .find({
          $or: [
            { "cliente.empresa": { $regex: q, $options: "i" } },
            { "cliente.rut": { $regex: q.replace(/[.\s-]/g, ""), $options: "i" } },
            { "cliente.rut": { $regex: q, $options: "i" } },
          ],
        })
        .limit(10)
        .toArray()

      for (const c of cotizaciones) {
        const doc = c as Record<string, unknown>
        const cliente = doc.cliente as { empresa?: string; rut?: string } | undefined
        if (cliente?.empresa?.trim() || cliente?.rut?.trim()) {
          const key = `${(cliente.empresa || "").trim()}-${(cliente.rut || "").trim()}`
          if (!empresasMap.has(key)) {
            const emp = (cliente.empresa || "").trim()
            const r = (cliente.rut || "").trim()
            empresasMap.set(key, {
              id: `cot-${emp}::${r}`,
              nombre: emp,
              rut: r,
            })
          }
        }
      }
    }

    const empresas = Array.from(empresasMap.values())
      .slice(0, 15)
      .map((e) => ({
        id: e.id,
        nombre: e.nombre,
        rut: e.rut,
        createdAt: undefined,
        updatedAt: undefined,
      }))
    return NextResponse.json(empresas)
  } catch (error) {
    console.error("Error al buscar empresas:", error)
    return NextResponse.json({ error: "Error al buscar empresas" }, { status: 500 })
  }
}
