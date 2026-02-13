"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Download,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  History,
} from "lucide-react"
import type { Cotizacion } from "@/types/cotizacion"
import { HistorialDescargasModal } from "@/components/cotizacion/HistorialDescargasModal"

export type CotizacionSortColumn = "numero" | "fecha" | "cliente" | "total" | null
export type SortDirection = "asc" | "desc"

interface AdminCotizacionTableProps {
  cotizaciones: Cotizacion[]
  searchQuery: string
  onSearchChange: (q: string) => void
  filterCliente: string
  onFilterClienteChange: (v: string) => void
  filterFechaDesde: string
  filterFechaHasta: string
  onFilterFechaDesdeChange: (v: string) => void
  onFilterFechaHastaChange: (v: string) => void
  sortColumn: CotizacionSortColumn
  sortDirection: SortDirection
  onSort: (column: CotizacionSortColumn) => void
  onDelete: (c: Cotizacion) => void
  emptyMessage?: string
}

function SortIcon({
  column,
  sortColumn,
  sortDirection,
}: {
  column: CotizacionSortColumn
  sortColumn: CotizacionSortColumn
  sortDirection: SortDirection
}) {
  if (sortColumn !== column)
    return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-50 inline" />
  return sortDirection === "asc" ? (
    <ArrowUp className="w-3.5 h-3.5 ml-1 text-sky-500 inline" />
  ) : (
    <ArrowDown className="w-3.5 h-3.5 ml-1 text-sky-500 inline" />
  )
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(n)
}

export function AdminCotizacionTable({
  cotizaciones,
  searchQuery,
  onSearchChange,
  filterCliente,
  onFilterClienteChange,
  filterFechaDesde,
  filterFechaHasta,
  onFilterFechaDesdeChange,
  onFilterFechaHastaChange,
  sortColumn,
  sortDirection,
  onSort,
  onDelete,
  emptyMessage = "No hay cotizaciones.",
}: AdminCotizacionTableProps) {
  const [historialCotizacionId, setHistorialCotizacionId] = useState<string | null>(null)
  const [historialCotizacionNumero, setHistorialCotizacionNumero] = useState<string>("")

  const clientesUnicos = Array.from(
    new Set(
      cotizaciones
        .map((c) => c.cliente?.empresa?.trim())
        .filter((v): v is string => !!v)
    )
  ).sort()

  const filtered = cotizaciones.filter((c) => {
    const q = searchQuery.toLowerCase().trim()
    const matchSearch =
      !q ||
      (c.numero && c.numero.toLowerCase().includes(q)) ||
      (c.cliente?.empresa &&
        c.cliente.empresa.toLowerCase().includes(q)) ||
      (c.cliente?.contacto &&
        c.cliente.contacto.toLowerCase().includes(q))
    const matchCliente =
      !filterCliente || c.cliente?.empresa === filterCliente
    const matchFechaDesde =
      !filterFechaDesde || c.fecha >= filterFechaDesde
    const matchFechaHasta =
      !filterFechaHasta || c.fecha <= filterFechaHasta
    return matchSearch && matchCliente && matchFechaDesde && matchFechaHasta
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0
    let cmp = 0
    if (sortColumn === "numero") {
      cmp = (a.numero || "").localeCompare(b.numero || "")
    } else if (sortColumn === "fecha") {
      cmp = (a.fecha || "").localeCompare(b.fecha || "")
    } else if (sortColumn === "cliente") {
      cmp = (a.cliente?.empresa || "").localeCompare(
        b.cliente?.empresa || ""
      )
    } else if (sortColumn === "total") {
      cmp = (a.total || 0) - (b.total || 0)
    }
    return sortDirection === "asc" ? cmp : -cmp
  })

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por número de cotización, cliente, contacto..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <select
            value={filterCliente}
            onChange={(e) => onFilterClienteChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm min-w-[180px]"
          >
            <option value="">Todos los clientes</option>
            {clientesUnicos.map((empresa) => (
              <option key={empresa} value={empresa}>
                {empresa}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterFechaDesde}
              onChange={(e) => onFilterFechaDesdeChange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
              placeholder="Desde"
            />
            <span className="text-slate-400 text-sm">a</span>
            <input
              type="date"
              value={filterFechaHasta}
              onChange={(e) => onFilterFechaHastaChange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
              placeholder="Hasta"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {sorted.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("numero")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Nº
                      <SortIcon
                        column="numero"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("fecha")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Fecha
                      <SortIcon
                        column="fecha"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("cliente")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Cliente
                      <SortIcon
                        column="cliente"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button
                      onClick={() => onSort("total")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center ml-auto"
                    >
                      Total
                      <SortIcon
                        column="total"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 w-40">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {c.numero}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.fecha}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">
                        {c.cliente?.empresa || "—"}
                      </span>
                      {c.cliente?.contacto && (
                        <span className="block text-sm text-slate-500">
                          {c.cliente.contacto}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800">
                      {formatPrice(c.total)}
                    </td>
                    <td className="py-3 px-4">
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
                        <button
                          type="button"
                          onClick={() => {
                            setHistorialCotizacionId(c.id)
                            setHistorialCotizacionNumero(c.numero || "")
                          }}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition"
                          title="Historial de descargas"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/cotizaciones/${c.id}`}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onDelete(c)}
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
        )}
      </div>

      {historialCotizacionId && (
        <HistorialDescargasModal
          cotizacionId={historialCotizacionId}
          cotizacionNumero={historialCotizacionNumero}
          onClose={() => {
            setHistorialCotizacionId(null)
            setHistorialCotizacionNumero("")
          }}
        />
      )}
    </>
  )
}
