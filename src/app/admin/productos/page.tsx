"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import type { Product } from "@/types/product"
import { AdminProductTable, type SortColumn, type SortDirection } from "@/components/AdminProductTable"

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const searchParams = useSearchParams()

  async function loadProducts() {
    const res = await fetch("/api/products?admin=true")
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
    setLoading(false)
  }

  async function loadCategories() {
    const res = await fetch("/api/categories")
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  useEffect(() => {
    const editId = searchParams.get("edit")
    if (editId && products.length > 0) {
      const p = products.find((x) => x.id === editId)
      if (p) {
        setEditing(p)
        setShowForm(true)
      }
    }
  }, [searchParams, products])

  async function toggleVisible(p: Product) {
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !(p.visible !== false) }),
    })
    if (res.ok) loadProducts()
  }

  async function toggleShowPublicPrice(p: Product) {
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showPublicPrice: p.showPublicPrice === false }),
    })
    if (res.ok) loadProducts()
  }

  async function toggleFeatured(p: Product) {
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    })
    if (res.ok) loadProducts()
  }

  function handleSort(column: SortColumn) {
    setSortColumn(column)
    setSortDirection((d) => (sortColumn === column && d === "asc" ? "desc" : "asc"))
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-500">
        Cargando productos...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
        >
          + Nuevo producto
        </button>
      </div>

      {showForm && (
        <ProductForm
          categories={categories}
          product={editing ?? undefined}
          onClose={() => {
            setShowForm(false)
            setEditing(null)
          }}
          onSave={() => {
            loadProducts()
            setShowForm(false)
            setEditing(null)
          }}
        />
      )}

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
        onEdit={(p) => {
          setEditing(p)
          setShowForm(true)
        }}
        onDelete={async (p) => {
          if (!confirm("¿Eliminar este producto?")) return
          const res = await fetch(`/api/products/${p.id}`, { method: "DELETE" })
          if (res.ok) loadProducts()
        }}
        emptyMessage="No hay productos. Agrega el primero."
      />

      <p className="mt-6">
        <Link href="/admin" className="text-sky-600 hover:underline">
          ← Volver al panel
        </Link>
      </p>
    </div>
  )
}

function ProductForm({
  categories,
  product,
  onClose,
  onSave,
}: {
  categories: Category[]
  product?: Product
  onClose: () => void
  onSave: () => void
}) {
  const [name, setName] = useState(product?.name ?? "")
  const [brand, setBrand] = useState(product?.brand ?? "")
  const [categorySlug, setCategorySlug] = useState(product?.categorySlug ?? categories[0]?.slug ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState<number>(product?.price ?? 0)
  const [image, setImage] = useState(product?.image ?? "")
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [inStock, setInStock] = useState(product?.inStock ?? true)
  const [visible, setVisible] = useState(product?.visible !== false)
  const [showPublicPrice, setShowPublicPrice] = useState(product?.showPublicPrice !== false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const category = categories.find((c) => c.slug === categorySlug)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.url) setImage(data.url)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name,
        brand: brand || "Genérico",
        category: category?.name ?? categorySlug,
        categorySlug,
        description,
        price,
        image,
        featured,
        inStock,
        visible,
        showPublicPrice,
      }

      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al guardar")
      }
      onSave()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            {product ? "Editar producto" : "Nuevo producto"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Marca
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="HP, Lenovo, etc."
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoría *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Precio (CLP)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={price ? `$${price.toLocaleString("es-CL")}` : ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "")
                  const num = parseInt(raw, 10) || 0
                  setPrice(num)
                }}
                placeholder="$ 0"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Foto del producto
              </label>
              <div className="flex gap-4 items-start">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="text-sm"
                />
                {uploading && <span className="text-sm text-slate-500">Subiendo...</span>}
              </div>
              {image && (
                <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden bg-slate-100">
                  <Image
                    src={image.startsWith("http") || image.startsWith("/") ? image : `/${image}`}
                    alt="Preview"
                    fill
                    unoptimized={image.startsWith("http")}
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span className="text-sm">Destacado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <span className="text-sm">En stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                />
                <span className="text-sm">Visible en catálogo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPublicPrice}
                  onChange={(e) => setShowPublicPrice(e.target.checked)}
                />
                <span className="text-sm">{showPublicPrice ? "Ocultar precio" : "Mostrar precio público"}</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
