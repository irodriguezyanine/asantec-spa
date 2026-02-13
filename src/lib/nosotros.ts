import { getDb } from "./db"
import type { NosotrosContent } from "@/types/nosotros"
import { NOSOTROS_DEFAULTS } from "@/types/nosotros"

export async function getNosotrosContent(): Promise<NosotrosContent> {
  try {
    const db = await getDb()
    const doc = await db.collection("nosotros").findOne({ key: "main" })
    if (!doc) return NOSOTROS_DEFAULTS
    const { key: _k, ...rest } = doc as Record<string, unknown>
    return { ...NOSOTROS_DEFAULTS, ...rest } as NosotrosContent
  } catch {
    return NOSOTROS_DEFAULTS
  }
}
