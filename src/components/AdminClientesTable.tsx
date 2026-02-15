"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Pencil,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
} from "lucide-react"
import type { ClienteAgregado } from "@/app/api/admin/clientes/route"

export type ClienteSortColumn =
  | "ultimaCotizacion"
  | "nombreCliente"
  | "rut"
  | "empresa"
  | "fono"
  | "mail"
  | "totalCotizaciones"
  | null
export type SortDirection = "asc" | "desc"

interface AdminClientesTableProps {
  clientes: ClienteAgregado[]
  searchQuery: string
  onSearchChange: (q: string) => void
  sortColumn: ClienteSortColumn
  sortDirection: SortDirection
  onSort: (column: ClienteSortColumn) => void
  onEdit: (c: ClienteAgregado) => void
  emptyMessage?: string
}

function SortIcon({
  column,
  sortColumn,
  sortDirection,
}: {
  column: ClienteSortColumn
  sortColumn: ClienteSortColumn
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

export function AdminClientesTable({
  clientes,
  searchQuery,
  onSearchChange,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  emptyMessage = "No hay clientes.",
}: AdminClientesTableProps) {
  const [filterEmpresa, setFilterEmpresa] = useState("")

  const empresasUnicas = Array.from(new Set(clientes.map((c) => c.empresa).filter(Boolean))).sort()

  const filtered = clientes.filter((c) => {
    const q = searchQuery.toLowerCase().trim()
    const searchableText = [
      c.ultimaCotizacionFecha,
      c.ultimaCotizacionNumero,
      c.contacto,
      c.rut,
      c.empresa,
      c.fono,
      c.mail,
      String(c.totalCotizaciones),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    const matchSearch = !q || searchableText.includes(q)
    const matchEmpresa = !filterEmpresa || c.empresa === filterEmpresa
    return matchSearch && matchEmpresa
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0
    let cmp = 0
    if (sortColumn === "ultimaCotizacion") {
      cmp = (a.ultimaCotizacionFecha || "").localeCompare(b.ultimaCotizacionFecha || "")
    } else if (sortColumn === "nombreCliente") {
      cmp = (a.contacto || "").localeCompare(b.contacto || "")
    } else if (sortColumn === "rut") {
      cmp = (a.rut || "").localeCompare(b.rut || "")
    } else if (sortColumn === "empresa") {
      cmp = (a.empresa || "").localeCompare(b.empresa || "")
    } else if (sortColumn === "fono") {
      cmp = (a.fono || "").localeCompare(b.fono || "")
    } else if (sortColumn === "mail") {
      cmp = (a.mail || "").localeCompare(b.mail || "")
    } else if (sortColumn === "totalCotizaciones") {
      cmp = a.totalCotizaciones - b.totalCotizaciones
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
              placeholder="Buscar en todas las columnas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <select
            value={filterEmpresa}
            onChange={(e) => setFilterEmpresa(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm min-w-[180px]"
          >
            <option value="">Todas las empresas</option>
            {empresasUnicas.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {sorted.length === 0 ? (
          <div className="p-12 text-center text-slate-500">{emptyMessage}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("ultimaCotizacion")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Última cotización
                      <SortIcon
                        column="ultimaCotizacion"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("nombreCliente")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Nombre cliente
                      <SortIcon
                        column="nombreCliente"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("rut")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      RUT
                      <SortIcon column="rut" sortColumn={sortColumn} sortDirection={sortDirection} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("empresa")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Empresa
                      <SortIcon
                        column="empresa"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("fono")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Contacto
                      <SortIcon column="fono" sortColumn={sortColumn} sortDirection={sortDirection} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("mail")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Mail
                      <SortIcon column="mail" sortColumn={sortColumn} sortDirection={sortDirection} />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button
                      onClick={() => onSort("totalCotizaciones")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center ml-auto"
                    >
                      Total cotiz.
                      <SortIcon
                        column="totalCotizaciones"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 w-24">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/cotizaciones/${c.ultimaCotizacionId}`}
                        className="inline-flex items-center gap-1.5 text-sky-600 hover:underline font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        {c.ultimaCotizacionFecha} (Nº {c.ultimaCotizacionNumero})
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {c.contacto || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.rut || "—"}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{c.empresa}</td>
                    <td className="py-3 px-4 text-slate-600">{c.fono || "—"}</td>
                    <td className="py-3 px-4 text-slate-600">{c.mail || "—"}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800">
                      {c.totalCotizaciones}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(c)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
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
    </>
  )
}
