"use client"

import {
  Search,
  Pencil,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import type { UsuarioAdmin } from "@/app/api/admin/usuarios/route"

export type UsuarioSortColumn = "nombre" | "apellido" | "mail" | "cargo" | "canManageUsers" | null
export type SortDirection = "asc" | "desc"

interface AdminUsuariosTableProps {
  usuarios: UsuarioAdmin[]
  searchQuery: string
  onSearchChange: (q: string) => void
  sortColumn: UsuarioSortColumn
  sortDirection: SortDirection
  onSort: (column: UsuarioSortColumn) => void
  onEdit: (u: UsuarioAdmin) => void
  emptyMessage?: string
}

function SortIcon({
  column,
  sortColumn,
  sortDirection,
}: {
  column: UsuarioSortColumn
  sortColumn: UsuarioSortColumn
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

export function AdminUsuariosTable({
  usuarios,
  searchQuery,
  onSearchChange,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  emptyMessage = "No hay usuarios.",
}: AdminUsuariosTableProps) {
  const filtered = usuarios.filter((u) => {
    const q = searchQuery.toLowerCase().trim()
    const searchableText = [
      u.nombre,
      u.apellido,
      u.mail,
      u.displayName,
      u.cargo,
      u.canManageUsers ? "gestionar usuarios" : "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    return !q || searchableText.includes(q)
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0
    let cmp = 0
    if (sortColumn === "nombre") {
      cmp = (a.nombre || "").localeCompare(b.nombre || "")
    } else if (sortColumn === "apellido") {
      cmp = (a.apellido || "").localeCompare(b.apellido || "")
    } else if (sortColumn === "mail") {
      cmp = (a.mail || "").localeCompare(b.mail || "")
    } else if (sortColumn === "cargo") {
      cmp = (a.cargo || "").localeCompare(b.cargo || "")
    } else if (sortColumn === "canManageUsers") {
      cmp = (a.canManageUsers ? 1 : 0) - (b.canManageUsers ? 1 : 0)
    }
    return sortDirection === "asc" ? cmp : -cmp
  })

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
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
                      onClick={() => onSort("nombre")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Nombre
                      <SortIcon
                        column="nombre"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("apellido")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Apellido
                      <SortIcon
                        column="apellido"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("mail")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Correo
                      <SortIcon
                        column="mail"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("cargo")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Cargo
                      <SortIcon
                        column="cargo"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("canManageUsers")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Atribuciones
                      <SortIcon
                        column="canManageUsers"
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
                {sorted.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {u.nombre || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.apellido || "—"}</td>
                    <td className="py-3 px-4 text-slate-600">{u.mail}</td>
                    <td className="py-3 px-4 text-slate-600">{u.cargo || "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${u.canManageUsers ? "bg-sky-100 text-sky-800" : "bg-slate-100 text-slate-600"}`}>
                        {u.canManageUsers ? "Gestionar usuarios" : "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(u)}
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
