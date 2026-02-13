import { getDb } from "./db"
import type { NosotrosContent } from "@/types/nosotros"
import { NOSOTROS_DEFAULTS } from "@/types/nosotros"

export async function getNosotrosContent(): Promise<NosotrosContent> {
  try {
    const db = await getDb()
    const doc = await db.collection("nosotros").findOne({ _id: "main" })
    if (!doc) return NOSOTROS_DEFAULTS
    return { ...NOSOTROS_DEFAULTS, ...doc } as NosotrosContent
  } catch {
    return NOSOTROS_DEFAULTS
  }
}
