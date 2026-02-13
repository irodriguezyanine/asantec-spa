"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"
import type { Cotizacion } from "@/types/cotizacion"
import {
  AdminCotizacionTable,
  type CotizacionSortColumn,
  type SortDirection,
} from "@/components/AdminCotizacionTable"

export default function AdminCotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCliente, setFilterCliente] = useState("")
  const [filterFechaDesde, setFilterFechaDesde] = useState("")
  const [filterFechaHasta, setFilterFechaHasta] = useState("")
  const [sortColumn, setSortColumn] = useState<CotizacionSortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

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

  function handleSort(column: CotizacionSortColumn) {
    setSortColumn(column)
    setSortDirection((d) =>
      sortColumn === column && d === "asc" ? "desc" : "asc"
    )
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
        <AdminCotizacionTable
          cotizaciones={cotizaciones}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterCliente={filterCliente}
          onFilterClienteChange={setFilterCliente}
          filterFechaDesde={filterFechaDesde}
          filterFechaHasta={filterFechaHasta}
          onFilterFechaDesdeChange={setFilterFechaDesde}
          onFilterFechaHastaChange={setFilterFechaHasta}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onDelete={handleDelete}
          emptyMessage="No hay cotizaciones que coincidan con los filtros."
        />
      )}

      <p className="mt-6">
        <Link href="/admin" className="text-sky-600 hover:underline">
          ← Volver al panel
        </Link>
      </p>
    </div>
  )
}
