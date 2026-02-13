"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from "lucide-react"

interface UserProfile {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  rut: string
  mail: string
  telefono: string
  cargo: string
}

export default function AdminPerfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    rut: "",
    mail: "",
    telefono: "",
    cargo: "",
  })
  const [claveActual, setClaveActual] = useState("")
  const [nuevaClave, setNuevaClave] = useState("")
  const [confirmarClave, setConfirmarClave] = useState("")
  const [showClaveActual, setShowClaveActual] = useState(false)
  const [showNuevaClave, setShowNuevaClave] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin/login")
  }, [status, router])

  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/admin/perfil")
      .then((r) => {
        if (!r.ok) throw new Error("Error al cargar")
        return r.json()
      })
      .then(setProfile)
      .catch(() => setError("Error al cargar el perfil"))
      .finally(() => setLoading(false))
  }, [status])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (nuevaClave && nuevaClave !== confirmarClave) {
      setError("La nueva contraseña y la confirmación no coinciden.")
      return
    }
    if (nuevaClave && nuevaClave.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.")
      return
    }
    setSaving(true)
    try {
      const body: Record<string, string> = { ...profile }
      if (nuevaClave) {
        body.claveActual = claveActual
        body.nuevaClave = nuevaClave
      }
      const res = await fetch("/api/admin/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Error al guardar")
      }
      setProfile(data)
      setClaveActual("")
      setNuevaClave("")
      setConfirmarClave("")
      alert("Perfil actualizado correctamente.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al panel
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-8">Editar Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 mb-4">Datos personales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                value={profile.nombre}
                onChange={(e) => setProfile((p) => ({ ...p, nombre: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido Paterno</label>
              <input
                type="text"
                value={profile.apellidoPaterno}
                onChange={(e) => setProfile((p) => ({ ...p, apellidoPaterno: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido Materno</label>
              <input
                type="text"
                value={profile.apellidoMaterno}
                onChange={(e) => setProfile((p) => ({ ...p, apellidoMaterno: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">RUT</label>
              <input
                type="text"
                value={profile.rut}
                onChange={(e) => setProfile((p) => ({ ...p, rut: e.target.value }))}
                placeholder="12.345.678-9"
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mail</label>
              <input
                type="email"
                value={profile.mail}
                onChange={(e) => setProfile((p) => ({ ...p, mail: e.target.value }))}
                placeholder="correo@ejemplo.cl"
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
              <p className="text-xs text-slate-500 mt-1">
                Se usa como usuario para iniciar sesión
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={profile.telefono}
                onChange={(e) => setProfile((p) => ({ ...p, telefono: e.target.value }))}
                placeholder="+56 9 1234 5678"
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cargo</label>
              <input
                type="text"
                value={profile.cargo}
                onChange={(e) => setProfile((p) => ({ ...p, cargo: e.target.value }))}
                placeholder="Ej: Administrador"
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 mb-4">Cambiar contraseña</h2>
          <p className="text-sm text-slate-600 mb-4">
            Deje en blanco si no desea cambiar la contraseña.
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña actual</label>
            <div className="relative">
              <input
                type={showClaveActual ? "text" : "password"}
                value={claveActual}
                onChange={(e) => setClaveActual(e.target.value)}
                placeholder="Solo si va a cambiar la clave"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowClaveActual((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showClaveActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nueva contraseña</label>
            <div className="relative">
              <input
                type={showNuevaClave ? "text" : "password"}
                value={nuevaClave}
                onChange={(e) => setNuevaClave(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNuevaClave((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNuevaClave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmarClave}
              onChange={(e) => setConfirmarClave(e.target.value)}
              placeholder="Repita la nueva contraseña"
              className="w-full px-4 py-2 rounded-lg border border-slate-300"
            />
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  )
}
