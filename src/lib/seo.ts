import { getDb } from "./db"

const SETTINGS_KEY = "site"
const DEFAULT_TITLE = "ASANTEC SPA | Tu socio tecnológico - Soluciones informáticas en Chile"
const DEFAULT_DESCRIPTION =
  "Más de 10 años ofreciendo hardware, computadores, monitores, periféricos y soluciones tecnológicas para empresas, colegios, universidades y particulares. Entrega en todo Chile."
const DEFAULT_KEYWORDS = [
  "tecnología Chile",
  "computadores",
  "hardware",
  "venta empresas",
  "soluciones informáticas",
  "ASANTEC",
]

export interface SeoConfig {
  title: string
  description: string
  keywords: string[]
}

export async function getSeoConfig(): Promise<SeoConfig> {
  try {
    const db = await getDb()
    const doc = await db.collection("settings").findOne({ key: SETTINGS_KEY })
    if (!doc) {
      return {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        keywords: DEFAULT_KEYWORDS,
      }
    }
    const keywords = doc.seoKeywords
    return {
      title: doc.seoTitle && typeof doc.seoTitle === "string" ? doc.seoTitle : DEFAULT_TITLE,
      description:
        doc.seoDescription && typeof doc.seoDescription === "string"
          ? doc.seoDescription
          : DEFAULT_DESCRIPTION,
      keywords: Array.isArray(keywords) ? keywords.filter((k) => typeof k === "string") : DEFAULT_KEYWORDS,
    }
  } catch {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      keywords: DEFAULT_KEYWORDS,
    }
  }
}
