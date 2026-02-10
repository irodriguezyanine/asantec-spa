"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Upload,
  Download,
  Package,
  FolderTree,
  Eye,
  EyeOff,
  Star,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react"
import type { Product } from "@/types/product"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"productos" | "categorias" | "importar">("productos")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ imported: number; errors?: string[] } | null>(null)
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
    const res = await fetch("/api/categories")
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  useEffect(() => {
    Promise.all([loadProducts(), loadCategories()]).finally(() => setLoading(false))
  }, [])

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

  async function toggleFeatured(product: Product) {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !product.featured }),
    })
    if (res.ok) loadProducts()
  }

  const filteredProducts = filterCategory
    ? products.filter((p) => p.categorySlug === filterCategory)
    : products

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
        <>
          <div className="flex gap-4 mb-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
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
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No hay productos. Importa un archivo Excel o crea uno manualmente.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Producto</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Categoría</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Precio</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Visible</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Destacado</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
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
                            <span className="font-medium text-slate-800 line-clamp-2">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">{p.category}</td>
                        <td className="py-3 px-4 font-semibold text-sky-600">{p.priceFormatted}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleVisible(p)}
                            className={`p-2 rounded-lg transition ${
                              p.visible !== false ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-slate-400 hover:bg-slate-100"
                            }`}
                            title={p.visible !== false ? "Visible en catálogo" : "Oculto"}
                          >
                            {p.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleFeatured(p)}
                            className={`p-2 rounded-lg transition ${
                              p.featured ? "text-amber-500 bg-amber-50 hover:bg-amber-100" : "text-slate-400 hover:bg-slate-100"
                            }`}
                            title={p.featured ? "Destacado" : "No destacado"}
                          >
                            <Star className={`w-4 h-4 ${p.featured ? "fill-current" : ""}`} />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/admin/productos`}
                            className="inline-flex p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-sky-600"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
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
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-sm text-slate-500">{c.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(c)
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
          </div>
        </div>
      )}

      {activeTab === "importar" && (
        <div className="space-y-6">
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
  onClose,
  onSave,
}: {
  category: Category | null
  onClose: () => void
  onSave: () => void
}) {
  const [name, setName] = useState(category?.name ?? "")
  const [slug, setSlug] = useState(category?.slug ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [saving, setSaving] = useState(false)

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
        ? { name, slug, description }
        : { name, slug: slug || slugify(name), description }
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
