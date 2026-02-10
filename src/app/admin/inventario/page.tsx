"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Upload,
  Download,
  Package,
  FolderTree,
  Plus,
  X,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react"
import type { Product } from "@/types/product"
import { AdminProductTable, type SortColumn, type SortDirection } from "@/components/AdminProductTable"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  visible?: boolean
  parentId?: string | null
}

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"productos" | "categorias" | "importar">("productos")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ imported: number; errors?: string[] } | null>(null)
  const [stockActualLoading, setStockActualLoading] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  async function loadProducts() {
    const res = await fetch("/api/products?admin=true")
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
  }

  async function loadCategories() {
    const res = await fetch("/api/categories?admin=true")
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  useEffect(() => {
    Promise.all([loadProducts(), loadCategories()]).finally(() => setLoading(false))
  }, [])

  async function loadStockActual() {
    setStockActualLoading(true)
    try {
      const res = await fetch("/api/seed/stock-actual", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        loadProducts()
        loadCategories()
        setUploadResult({ imported: data.imported ?? 17 })
      } else {
        setUploadResult({ imported: 0, errors: [data.error ?? "Error"] })
      }
    } catch {
      setUploadResult({ imported: 0, errors: ["Error al cargar STOCK ACTUAL"] })
    } finally {
      setStockActualLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadResult(null)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/products/import", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) {
        setUploadResult({ imported: data.imported, errors: data.errors })
        loadProducts()
        loadCategories()
      } else {
        setUploadResult({ imported: 0, errors: [data.error] })
      }
    } catch {
      setUploadResult({ imported: 0, errors: ["Error al subir el archivo"] })
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  async function toggleVisible(product: Product) {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !(product.visible !== false) }),
    })
    if (res.ok) loadProducts()
  }

  async function toggleShowPublicPrice(product: Product) {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showPublicPrice: product.showPublicPrice === false }),
    })
    if (res.ok) loadProducts()
  }

  async function toggleFeatured(product: Product) {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !product.featured }),
    })
    if (res.ok) loadProducts()
  }

  function handleSort(column: SortColumn) {
    setSortColumn(column)
    setSortDirection((d) => (sortColumn === column && d === "asc" ? "desc" : "asc"))
  }

  async function toggleCategoryVisible(c: Category) {
    const res = await fetch(`/api/categories/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: c.visible === false }),
    })
    if (res.ok) loadCategories()
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        Cargando inventario...
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Inventario</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
          >
            <Plus className="w-4 h-4" />
            Nuevo producto
          </Link>
          <a
            href="/plantilla-inventario.csv"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            <Download className="w-4 h-4" />
            Plantilla CSV
          </a>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {(["productos", "categorias", "importar"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition ${
              activeTab === tab
                ? "bg-white border border-slate-200 border-b-0 text-sky-600 -mb-px"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "productos" && <><Package className="w-4 h-4 inline mr-2" />Productos</>}
            {tab === "categorias" && <><FolderTree className="w-4 h-4 inline mr-2" />Categorías</>}
            {tab === "importar" && <><Upload className="w-4 h-4 inline mr-2" />Importar Excel</>}
          </button>
        ))}
      </div>

      {activeTab === "productos" && (
        <AdminProductTable
          products={products}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterCategory={filterCategory}
          onFilterCategoryChange={setFilterCategory}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onToggleVisible={toggleVisible}
          onToggleShowPublicPrice={toggleShowPublicPrice}
          onToggleFeatured={toggleFeatured}
          onEdit={() => {}}
          editMode="link"
          emptyMessage="No hay productos. Importa un archivo Excel o crea uno manualmente."
        />
      )}

      {activeTab === "categorias" && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setEditingCategory(null)
              setShowCategoryForm(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            Nueva categoría
          </button>
          {showCategoryForm && (
            <CategoryForm
              category={editingCategory}
              categories={categories}
              onClose={() => {
                setShowCategoryForm(false)
                setEditingCategory(null)
              }}
              onSave={() => {
                loadCategories()
                setShowCategoryForm(false)
                setEditingCategory(null)
              }}
            />
          )}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {categories
                .filter((c) => !c.parentId || !categories.some((p) => p.id === c.parentId))
                .map((parent) => {
                  const subcats = categories.filter((s) => s.parentId === parent.id)
                  return (
                    <div key={parent.id}>
                      <div className="flex items-center justify-between p-4 hover:bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-800">{parent.name}</p>
                          <p className="text-sm text-slate-500">{parent.slug}</p>
                          {parent.visible === false && (
                            <span className="text-xs text-amber-600 mt-1">Oculta del público</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleCategoryVisible(parent)}
                            className={`p-2 rounded-lg transition ${
                              parent.visible !== false ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-slate-400 hover:bg-slate-100"
                            }`}
                            title={parent.visible !== false ? "Visible (clic para ocultar)" : "Oculta (clic para mostrar)"}
                          >
                            {parent.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategory(parent)
                              setShowCategoryForm(true)
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-sky-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {subcats.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between pl-12 pr-4 py-2 hover:bg-slate-50 border-t border-slate-50">
                          <div>
                            <p className="font-medium text-slate-700 text-sm">↳ {sub.name}</p>
                            <p className="text-xs text-slate-500">{sub.slug}</p>
                            {sub.visible === false && (
                              <span className="text-xs text-amber-600">Oculta</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleCategoryVisible(sub)}
                              className={`p-2 rounded-lg transition ${
                                sub.visible !== false ? "text-green-600 bg-green-50" : "text-slate-400 hover:bg-slate-100"
                              }`}
                              title={sub.visible !== false ? "Visible" : "Oculta"}
                            >
                              {sub.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingCategory(sub)
                                setShowCategoryForm(true)
                              }}
                              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-sky-600"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "importar" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50">
            <h3 className="font-semibold text-slate-800 mb-2">Categoría STOCK ACTUAL</h3>
            <p className="text-sm text-slate-600 mb-3">
              Crea la categoría &quot;STOCK ACTUAL&quot; con 17 productos del inventario (NUC, placas madre, tarjetas de video, procesadores, memorias).
            </p>
            <button
              onClick={loadStockActual}
              disabled={stockActualLoading}
              className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50"
            >
              {stockActualLoading ? "Cargando..." : "Cargar STOCK ACTUAL"}
            </button>
          </div>
          <div
            className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-sky-400 hover:bg-sky-50/50 transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files?.[0]
              if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.name.endsWith(".csv"))) {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = ".xlsx,.xls,.csv"
                const dt = new DataTransfer()
                dt.items.add(file)
                input.files = dt.files
                input.onchange = (ev) => handleFileUpload(ev as unknown as React.ChangeEvent<HTMLInputElement>)
                input.click()
              }
            }}
          >
            <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="font-medium text-slate-700 mb-1">Sube un archivo Excel o CSV</p>
            <p className="text-sm text-slate-500 mb-4">
              Columnas: nombre, precio, categoria. Opcionales: marca, descripcion, imagen, visible (si/no), destacado (si/no)
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              {uploading ? "Subiendo..." : "Seleccionar archivo"}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          {uploadResult && (
            <div className={`p-4 rounded-lg ${uploadResult.imported > 0 ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
              <p className="font-medium">Se importaron {uploadResult.imported} productos.</p>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <ul className="mt-2 text-sm list-disc list-inside">
                  {uploadResult.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {uploadResult.errors.length > 5 && (
                    <li>... y {uploadResult.errors.length - 5} más</li>
                  )}
                </ul>
              )}
            </div>
          )}
          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
            <p className="font-medium mb-2">Formato del Excel/CSV:</p>
            <p>La primera fila debe tener encabezados. Nombres admitidos (en español o inglés):</p>
            <ul className="mt-1 list-disc list-inside">
              <li>nombre / name (obligatorio)</li>
              <li>precio / price (obligatorio)</li>
              <li>categoria / category (obligatorio)</li>
              <li>marca / brand</li>
              <li>descripcion / description</li>
              <li>imagen / image</li>
              <li>visible (si / no)</li>
              <li>destacado (si / no)</li>
            </ul>
          </div>
        </div>
      )}

      <p className="mt-8">
        <Link href="/admin" className="text-sky-600 hover:underline">
          ← Volver al panel
        </Link>
      </p>
    </div>
  )
}

function CategoryForm({
  category,
  categories,
  onClose,
  onSave,
}: {
  category: Category | null
  categories: Category[]
  onClose: () => void
  onSave: () => void
}) {
  const [name, setName] = useState(category?.name ?? "")
  const [slug, setSlug] = useState(category?.slug ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [parentId, setParentId] = useState<string>(category?.parentId ?? "")
  const [saving, setSaving] = useState(false)
  const parentOptions = categories.filter((c) => !c.parentId && c.id !== category?.id)

  function slugify(s: string) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = category ? `/api/categories/${category.id}` : "/api/categories"
      const method = category ? "PUT" : "POST"
      const body = category
        ? { name, slug, description, parentId: parentId || null }
        : { name, slug: slug || slugify(name), description, parentId: parentId || null }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) onSave()
      else {
        const data = await res.json()
        alert(data.error || "Error al guardar")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{category ? "Editar categoría" : "Nueva categoría"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (!category) setSlug(slugify(e.target.value))
              }}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300"
              placeholder="ej: computadores"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subcategoría de (opcional)</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300"
            >
              <option value="">Ninguna (categoría principal)</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
