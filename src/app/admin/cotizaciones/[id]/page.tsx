"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CotizacionEditor } from "@/components/cotizacion/CotizacionEditor"
import type { Cotizacion } from "@/types/cotizacion"

export default function EditarCotizacionPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/cotizaciones/${id}`)
      if (res.ok) {
        const data = await res.json()
        setCotizacion(data)
      } else {
        setCotizacion(null)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSave(data: Partial<Cotizacion>) {
    const res = await fetch(`/api/cotizaciones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Error al guardar")
    }
    const updated = await res.json()
    setCotizacion(updated)
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-500">
        Cargando cotización...
      </div>
    )
  }

  if (!cotizacion) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600 mb-4">Cotización no encontrada.</p>
        <Link href="/admin/cotizaciones" className="text-sky-600 hover:underline">
          ← Volver a cotizaciones
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Editar cotización Nº {cotizacion.numero}
      </h1>
      <CotizacionEditor
        cotizacion={cotizacion}
        onSave={handleSave}
        onCancel={() => router.push("/admin/cotizaciones")}
        cotizacionId={id}
      />
    </div>
  )
}
