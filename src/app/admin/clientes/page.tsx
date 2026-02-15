"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Plus, X } from "lucide-react"
import type { ClienteAgregado } from "@/app/api/admin/clientes/route"
import {
  AdminClientesTable,
  type ClienteSortColumn,
  type SortDirection,
} from "@/components/AdminClientesTable"

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<ClienteAgregado[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<ClienteSortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState<ClienteAgregado | null>(null)

  async function loadClientes() {
    const res = await fetch("/api/admin/clientes")
    if (res.ok) {
      const data = await res.json()
      setClientes(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadClientes()
  }, [])

  function handleSort(column: ClienteSortColumn) {
    setSortColumn(column)
    setSortDirection((d) =>
      sortColumn === column && d === "asc" ? "desc" : "asc"
    )
  }

  function openAddForm() {
    setEditingCliente(null)
    setShowForm(true)
  }

  function openEditForm(c: ClienteAgregado) {
    setEditingCliente(c)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-500">
        Cargando clientes...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
        <Link
          href="/admin/cotizaciones/nueva"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
        >
          <Plus className="w-5 h-5" />
          Agregar nuevo cliente
        </Link>
      </div>

      {clientes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-6">
            No hay clientes aún. Los clientes se registran al crear cotizaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
            >
              <Plus className="w-5 h-5" />
              Agregar cliente manualmente
            </button>
            <Link
              href="/admin/cotizaciones/nueva"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Crear primera cotización
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              <Plus className="w-4 h-4" />
              Agregar cliente
            </button>
          </div>
          <AdminClientesTable
            clientes={clientes}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={openEditForm}
            emptyMessage="No hay clientes que coincidan con los filtros."
          />
        </>
      )}

      {showForm && (
        <ClienteFormModal
          cliente={editingCliente}
          onClose={() => {
            setShowForm(false)
            setEditingCliente(null)
          }}
          onSave={() => {
            loadClientes()
            setShowForm(false)
            setEditingCliente(null)
          }}
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

function ClienteFormModal({
  cliente,
  onClose,
  onSave,
}: {
  cliente: ClienteAgregado | null
  onClose: () => void
  onSave: () => void
}) {
  const isEdit = !!cliente
  const [empresa, setEmpresa] = useState(cliente?.empresa ?? "")
  const [rut, setRut] = useState(cliente?.rut ?? "")
  const [contacto, setContacto] = useState(cliente?.contacto ?? "")
  const [mail, setMail] = useState(cliente?.mail ?? "")
  const [fono, setFono] = useState(cliente?.fono ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      if (isEdit) {
        const res = await fetch(
          `/api/admin/clientes/${encodeURIComponent(cliente.id)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              empresa,
              rut,
              contacto,
              mail,
              fono,
            }),
          }
        )
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al actualizar")
        alert(data.message || "Cliente actualizado.")
      } else {
        const res = await fetch("/api/admin/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            empresa,
            rut,
            contacto,
            mail,
            fono,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al agregar")
        alert("Cliente agregado. Aparecerá al buscar al crear cotizaciones.")
      }
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              {isEdit ? "Editar cliente" : "Agregar nuevo cliente"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Empresa *
              </label>
              <input
                type="text"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                RUT
              </label>
              <input
                type="text"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                placeholder="12.345.678-9"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del contacto
              </label>
              <input
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                placeholder="Nombre y apellido"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="email@empresa.cl"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={fono}
                onChange={(e) => setFono(e.target.value)}
                placeholder="+569 1234 5678"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50"
              >
                {saving ? "Guardando..." : isEdit ? "Actualizar" : "Agregar"}
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
