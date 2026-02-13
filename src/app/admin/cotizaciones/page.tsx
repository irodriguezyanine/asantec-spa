"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Plus, Download, Pencil, Trash2 } from "lucide-react"
import type { Cotizacion } from "@/types/cotizacion"

export default function AdminCotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)

  async function loadCotizaciones() {
    const res = await fetch("/api/cotizaciones")
    if (res.ok) {
      const data = await res.json()
      setCotizaciones(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCotizaciones()
  }, [])

  async function handleDelete(c: Cotizacion) {
    if (!confirm(`¿Eliminar cotización Nº ${c.numero}?`)) return
    const res = await fetch(`/api/cotizaciones/${c.id}`, { method: "DELETE" })
    if (res.ok) loadCotizaciones()
    else alert("Error al eliminar")
  }

  function formatPrice(n: number) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(n)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-500">
        Cargando cotizaciones...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Cotizaciones</h1>
        <Link
          href="/admin/cotizaciones/nueva"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nueva cotización
        </Link>
      </div>

      {cotizaciones.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-6">No hay cotizaciones aún.</p>
          <Link
            href="/admin/cotizaciones/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
          >
            <Plus className="w-5 h-5" />
            Crear primera cotización
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                    Nº
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
                    Cliente
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-slate-700">
                    Total
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-slate-700 w-40">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {cotizaciones.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {c.numero}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.fecha}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">
                        {c.cliente.empresa || "—"}
                      </span>
                      {c.cliente.contacto && (
                        <span className="block text-sm text-slate-500">
                          {c.cliente.contacto}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">
                      {formatPrice(c.total)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/cotizaciones/${c.id}/export-pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition"
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/admin/cotizaciones/${c.id}`}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(c)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-6">
        <Link href="/admin" className="text-sky-600 hover:underline">
          ← Volver al panel
        </Link>
      </p>
    </div>
  )
}
