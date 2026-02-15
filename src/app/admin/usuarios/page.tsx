"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession, useRouter } from "next-auth/react"
import { Users, Plus, X, UserPlus, Eye, EyeOff } from "lucide-react"
import type { UsuarioAdmin } from "@/app/api/admin/usuarios/route"
import {
  AdminUsuariosTable,
  type UsuarioSortColumn,
  type SortDirection,
} from "@/components/AdminUsuariosTable"

export default function AdminUsuariosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<UsuarioSortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [showForm, setShowForm] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<UsuarioAdmin | null>(null)

  async function loadUsuarios() {
    const res = await fetch("/api/admin/usuarios")
    if (res.ok) {
      const data = await res.json()
      setUsuarios(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin/login")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      const canManage = (session?.user as { canManageUsers?: boolean })?.canManageUsers
      if (!canManage) {
        router.replace("/admin")
        return
      }
      loadUsuarios()
    }
  }, [status, (session?.user as { canManageUsers?: boolean })?.canManageUsers])

  function handleSort(column: UsuarioSortColumn) {
    setSortColumn(column)
    setSortDirection((d) =>
      sortColumn === column && d === "asc" ? "desc" : "asc"
    )
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-500">
        Cargando usuarios...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
        <button
          type="button"
          onClick={() => {
            setEditingUsuario(null)
            setShowForm(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nuevo usuario
        </button>
      </div>

      {usuarios.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-6">No hay usuarios.</p>
          <button
            onClick={() => {
              setEditingUsuario(null)
              setShowForm(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
          >
            <Plus className="w-5 h-5" />
            Crear primer usuario
          </button>
        </div>
      ) : (
        <AdminUsuariosTable
          usuarios={usuarios}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onEdit={(u) => {
            setEditingUsuario(u)
            setShowForm(true)
          }}
          emptyMessage="No hay usuarios que coincidan con la búsqueda."
        />
      )}

      {showForm && (
        <UsuarioFormModal
          usuario={editingUsuario}
          onClose={() => {
            setShowForm(false)
            setEditingUsuario(null)
          }}
          onSave={() => {
            loadUsuarios()
            setShowForm(false)
            setEditingUsuario(null)
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

function UsuarioFormModal({
  usuario,
  onClose,
  onSave,
}: {
  usuario: UsuarioAdmin | null
  onClose: () => void
  onSave: () => void
}) {
  const isEdit = !!usuario
  const [nombre, setNombre] = useState(usuario?.nombre ?? "")
  const [apellido, setApellido] = useState(usuario?.apellido ?? "")
  const [mail, setMail] = useState(usuario?.mail ?? "")
  const [cargo, setCargo] = useState(usuario?.cargo ?? "Administrador")
  const [canManageUsers, setCanManageUsers] = useState(usuario?.canManageUsers ?? false)
  const [password, setPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!isEdit && (!password || password.length < 6)) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (!isEdit && password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (isEdit && password && password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (isEdit && password && password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        const body: Record<string, string | boolean> = {
          nombre,
          apellido,
          mail,
          cargo,
          canManageUsers,
        }
        if (password) {
          body.password = password
        }
        const res = await fetch(`/api/admin/usuarios/${usuario.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al actualizar")
        alert("Usuario actualizado correctamente.")
      } else {
        const res = await fetch("/api/admin/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            apellido,
            mail,
            password,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al crear usuario")
        alert("Usuario creado correctamente. Ya puede iniciar sesión.")
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
              {isEdit ? "Editar usuario" : "Nuevo usuario"}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Juan"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ej: Pérez"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico (usuario para login) *
              </label>
              <input
                type="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
                placeholder="correo@ejemplo.cl"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {isEdit && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="Administrador"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Atribuciones</h3>
                  <label className={`flex items-center gap-2 ${usuario.mail === "jorgeignaciorb@gmail.com" ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      checked={canManageUsers}
                      onChange={(e) => usuario.mail !== "jorgeignaciorb@gmail.com" && setCanManageUsers(e.target.checked)}
                      disabled={usuario.mail === "jorgeignaciorb@gmail.com"}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-sm text-slate-700">
                      Puede gestionar usuarios (crear, editar, ver panel Usuarios)
                      {usuario.mail === "jorgeignaciorb@gmail.com" && " (siempre activo)"}
                    </span>
                  </label>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isEdit ? "Nueva contraseña (dejar en blanco para no cambiar)" : "Contraseña *"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isEdit}
                  minLength={isEdit ? undefined : 6}
                  placeholder={isEdit ? "Solo si desea cambiarla" : "Mínimo 6 caracteres"}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 pr-10 focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isEdit ? "Confirmar nueva contraseña" : "Confirmar contraseña *"}
              </label>
              <div className="relative">
                <input
                  type={showConfirmar ? "text" : "password"}
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required={!isEdit}
                  minLength={isEdit ? undefined : 6}
                  placeholder={isEdit ? "Solo si cambió la contraseña" : "Repetir contraseña"}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 pr-10 focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50"
              >
                {saving ? (
                  <span>Guardando...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {isEdit ? "Actualizar" : "Crear usuario"}
                  </>
                )}
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
