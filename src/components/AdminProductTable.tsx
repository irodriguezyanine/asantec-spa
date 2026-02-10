"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Package,
  Eye,
  EyeOff,
  Star,
  Pencil,
  Globe,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react"
import type { Product } from "@/types/product"

export type SortColumn = "name" | "category" | "price" | null
export type SortDirection = "asc" | "desc"

interface AdminProductTableProps {
  products: Product[]
  categories: { id: string; name: string; slug: string }[]
  searchQuery: string
  onSearchChange: (q: string) => void
  filterCategory: string
  onFilterCategoryChange: (slug: string) => void
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
  onToggleVisible: (p: Product) => void
  onToggleShowPublicPrice: (p: Product) => void
  onToggleFeatured: (p: Product) => void
  onEdit: (p: Product) => void
  onDelete?: (p: Product) => void
  editMode?: "inline" | "link"
  emptyMessage?: string
}

function SortIcon({
  column,
  sortColumn,
  sortDirection,
}: {
  column: SortColumn
  sortColumn: SortColumn
  sortDirection: SortDirection
}) {
  if (sortColumn !== column) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-50 inline" />
  return sortDirection === "asc" ? (
    <ArrowUp className="w-3.5 h-3.5 ml-1 text-sky-500 inline" />
  ) : (
    <ArrowDown className="w-3.5 h-3.5 ml-1 text-sky-500 inline" />
  )
}

export function AdminProductTable({
  products,
  categories,
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterCategoryChange,
  sortColumn,
  sortDirection,
  onSort,
  onToggleVisible,
  onToggleShowPublicPrice,
  onToggleFeatured,
  onEdit,
  onDelete,
  editMode = "inline",
  emptyMessage = "No hay productos.",
}: AdminProductTableProps) {
  const filtered = products.filter((p) => {
    const matchSearch =
      !searchQuery.trim() ||
      [p.name, p.brand, p.category, p.description].some((v) =>
        String(v || "").toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    const matchCategory = !filterCategory || p.categorySlug === filterCategory
    return matchSearch && matchCategory
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0
    let cmp = 0
    if (sortColumn === "name") {
      cmp = (a.name || "").localeCompare(b.name || "")
    } else if (sortColumn === "category") {
      cmp = (a.category || "").localeCompare(b.category || "")
    } else if (sortColumn === "price") {
      cmp = (a.price || 0) - (b.price || 0)
    }
    return sortDirection === "asc" ? cmp : -cmp
  })

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por nombre, marca, categoría..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm min-w-[180px]"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
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
                      onClick={() => onSort("name")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Producto
                      <SortIcon column="name" sortColumn={sortColumn} sortDirection={sortDirection} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("category")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Categoría
                      <SortIcon column="category" sortColumn={sortColumn} sortDirection={sortDirection} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => onSort("price")}
                      className="text-sm font-semibold text-slate-600 hover:text-sky-600 flex items-center"
                    >
                      Precio
                      <SortIcon column="price" sortColumn={sortColumn} sortDirection={sortDirection} />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600" title="Visible en catálogo">
                    Catálogo
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600" title="Mostrar u ocultar precio a clientes">
                    Precio
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Destacado</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {p.image ? (
                            <Image
                              src={p.image.startsWith("http") || p.image.startsWith("/") ? p.image : `/${p.image}`}
                              alt=""
                              width={40}
                              height={40}
                              unoptimized={p.image.startsWith("http")}
                              className="object-contain"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-slate-800 line-clamp-2">{p.name}</span>
                          {p.visible === false && (
                            <span className="block mt-1 text-xs text-amber-600">Oculto del catálogo</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">{p.category}</td>
                    <td className="py-3 px-4 font-semibold text-sky-600">{p.priceFormatted}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleVisible(p)}
                        className={`p-2 rounded-lg transition ${
                          p.visible !== false ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-slate-400 hover:bg-slate-100"
                        }`}
                        title={p.visible !== false ? "Visible en catálogo" : "Oculto del catálogo"}
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleShowPublicPrice(p)}
                        className={`p-2 rounded-lg transition ${
                          p.showPublicPrice !== false ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-slate-400 hover:bg-slate-100"
                        }`}
                        title={p.showPublicPrice !== false ? "Precio visible" : "Precio oculto"}
                      >
                        {p.showPublicPrice !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleFeatured(p)}
                        className={`p-2 rounded-lg transition ${
                          p.featured ? "text-amber-500 bg-amber-50 hover:bg-amber-100" : "text-slate-400 hover:bg-slate-100"
                        }`}
                        title={p.featured ? "Destacado" : "No destacado"}
                      >
                        <Star className={`w-4 h-4 ${p.featured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onDelete ? (
                          <>
                            <button
                              onClick={() => onEdit(p)}
                              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-sky-600"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(p)}
                              className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                              title="Eliminar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        ) : editMode === "link" ? (
                          <Link
                            href={`/admin/productos?edit=${p.id}`}
                            className="inline-flex p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-sky-600"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                        ) : (
                          <button
                            onClick={() => onEdit(p)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-sky-600"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
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
