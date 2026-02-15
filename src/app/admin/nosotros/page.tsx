"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import type { NosotrosContent } from "@/types/nosotros"
import { NOSOTROS_DEFAULTS } from "@/types/nosotros"

export default function AdminNosotrosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin/login")
  }, [status, router])
  const [content, setContent] = useState<NosotrosContent>(NOSOTROS_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/nosotros")
      .then((r) => r.json())
      .then((data) => setContent({ ...NOSOTROS_DEFAULTS, ...data }))
      .catch(() => setContent(NOSOTROS_DEFAULTS))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/nosotros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
        credentials: "same-origin",
      })
      let data: { error?: string } = {}
      try {
        data = await res.json()
      } catch {
        // Respuesta no JSON (ej. 405)
      }
      if (!res.ok) throw new Error(data.error || `Error al guardar (${res.status})`)
      alert("Contenido guardado correctamente.")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar. Intente de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al panel
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-8">Editar Nosotros</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Hero (encabezado)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => setContent((c) => ({ ...c, heroTitle: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subtítulo</label>
              <textarea
                value={content.heroSubtitle}
                onChange={(e) => setContent((c) => ({ ...c, heroSubtitle: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Asantec Spa</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
              <input
                type="text"
                value={content.asantecTitle}
                onChange={(e) => setContent((c) => ({ ...c, asantecTitle: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Párrafo 1</label>
              <textarea
                value={content.asantecP1}
                onChange={(e) => setContent((c) => ({ ...c, asantecP1: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Párrafo 2</label>
              <textarea
                value={content.asantecP2}
                onChange={(e) => setContent((c) => ({ ...c, asantecP2: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Instituciones que confían</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
              <input
                type="text"
                value={content.institucionesTitle}
                onChange={(e) => setContent((c) => ({ ...c, institucionesTitle: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Párrafo</label>
              <textarea
                value={content.institucionesP}
                onChange={(e) => setContent((c) => ({ ...c, institucionesP: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Etiquetas (separadas por coma)
              </label>
              <input
                type="text"
                value={content.institucionesTags.join(", ")}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    institucionesTags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  }))
                }
                placeholder="Instituciones públicas, Universidades, ..."
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Planifique sus necesidades</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
              <input
                type="text"
                value={content.planifiqueTitle}
                onChange={(e) => setContent((c) => ({ ...c, planifiqueTitle: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Párrafo 1</label>
              <textarea
                value={content.planifiqueP1}
                onChange={(e) => setContent((c) => ({ ...c, planifiqueP1: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Párrafo 2</label>
              <textarea
                value={content.planifiqueP2}
                onChange={(e) => setContent((c) => ({ ...c, planifiqueP2: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Contacto destacado</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
              <input
                type="text"
                value={content.contactoTitle}
                onChange={(e) => setContent((c) => ({ ...c, contactoTitle: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Párrafo</label>
              <textarea
                value={content.contactoP}
                onChange={(e) => setContent((c) => ({ ...c, contactoP: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono 1</label>
                <input
                  type="text"
                  value={content.telefono1}
                  onChange={(e) => setContent((c) => ({ ...c, telefono1: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono 2</label>
                <input
                  type="text"
                  value={content.telefono2}
                  onChange={(e) => setContent((c) => ({ ...c, telefono2: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Tarjeta de cierre</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Texto de despedida</label>
              <input
                type="text"
                value={content.cierreTexto}
                onChange={(e) => setContent((c) => ({ ...c, cierreTexto: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre empresa</label>
              <input
                type="text"
                value={content.cierreEmpresa}
                onChange={(e) => setContent((c) => ({ ...c, cierreEmpresa: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input
                type="text"
                value={content.cierreDireccion}
                onChange={(e) => setContent((c) => ({ ...c, cierreDireccion: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={content.cierreTelefono}
                  onChange={(e) => setContent((c) => ({ ...c, cierreTelefono: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={content.cierreEmail}
                  onChange={(e) => setContent((c) => ({ ...c, cierreEmail: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Gerente General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título sección</label>
              <input
                type="text"
                value={content.gerenteTitle}
                onChange={(e) => setContent((c) => ({ ...c, gerenteTitle: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                value={content.gerenteNombre}
                onChange={(e) => setContent((c) => ({ ...c, gerenteNombre: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cargo</label>
              <input
                type="text"
                value={content.gerenteCargo}
                onChange={(e) => setContent((c) => ({ ...c, gerenteCargo: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea
                value={content.gerenteDescripcion}
                onChange={(e) => setContent((c) => ({ ...c, gerenteDescripcion: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ruta imagen</label>
              <input
                type="text"
                value={content.gerenteImagen}
                onChange={(e) => setContent((c) => ({ ...c, gerenteImagen: e.target.value }))}
                placeholder="/GerentegeneralASANTEC.png"
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Frase (ej: Entrega en todo Chile)</label>
              <input
                type="text"
                value={content.gerenteFrase}
                onChange={(e) => setContent((c) => ({ ...c, gerenteFrase: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-300"
              />
            </div>
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
          <Link
            href="/nosotros"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Ver página Nosotros
          </Link>
        </div>
      </form>
    </div>
  )
}
