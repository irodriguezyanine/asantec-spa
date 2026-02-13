import { getDb } from "./db"
import { ObjectId } from "mongodb"

/**
 * Normaliza RUT chileno para búsqueda (quita puntos y guión)
 */
export function normalizarRut(rut: string): string {
  return String(rut || "")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/\s/g, "")
    .toUpperCase()
}

/**
 * Upsert empresa: crea o actualiza por RUT o nombre
 */
export async function upsertEmpresa(
  nombre: string,
  rut: string
): Promise<string> {
  const db = await getDb()
  const collection = db.collection("empresas")
  const nombreTrim = (nombre || "").trim()
  const rutTrim = (rut || "").trim()
  const now = new Date()

  const or: Record<string, unknown>[] = []
  if (rutTrim) {
    or.push({ rut: { $regex: new RegExp(`^${rutTrim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } })
  }
  if (nombreTrim) {
    or.push({ nombre: { $regex: new RegExp(`^${nombreTrim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } })
  }

  const existing = or.length > 0 ? await collection.findOne({ $or: or }) : null

  if (existing) {
    await collection.updateOne(
      { _id: existing._id },
      {
        $set: {
          nombre: nombreTrim || (existing as { nombre?: string }).nombre,
          rut: rutTrim || (existing as { rut?: string }).rut,
          updatedAt: now,
        },
      }
    )
    return (existing._id as ObjectId).toString()
  }

  const result = await collection.insertOne({
    nombre: nombreTrim,
    rut: rutTrim,
    createdAt: now,
    updatedAt: now,
  })
  return result.insertedId.toString()
}

/**
 * Upsert contacto: crea o actualiza por empresaId + nombre
 */
export async function upsertContacto(
  empresaId: string,
  nombre: string,
  email: string,
  telefono: string
): Promise<string> {
  const db = await getDb()
  const collection = db.collection("contactos")
  const nombreNorm = (nombre || "").trim()
  const now = new Date()

  const existing = await collection.findOne({
    empresaId: new ObjectId(empresaId),
    nombre: { $regex: new RegExp(`^${nombreNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  })

  if (existing) {
    await collection.updateOne(
      { _id: existing._id },
      {
        $set: {
          email: (email || "").trim(),
          telefono: (telefono || "").trim(),
          updatedAt: now,
        },
      }
    )
    return (existing._id as ObjectId).toString()
  }

  const result = await collection.insertOne({
    empresaId: new ObjectId(empresaId),
    nombre: nombreNorm,
    email: (email || "").trim(),
    telefono: (telefono || "").trim(),
    createdAt: now,
    updatedAt: now,
  })
  return result.insertedId.toString()
}
