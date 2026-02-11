"use client"

import { useEffect, useState } from "react"
import { Search, Save, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminSeoPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.seoTitle ?? "")
        setDescription(data.seoDescription ?? "")
        setKeywords(Array.isArray(data.seoKeywords) ? data.seoKeywords.join(", ") : "")
      })
      .catch(() => setMessage({ type: "error", text: "Error al cargar configuración" }))
      .finally(() => setLoading(false))
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const keywordsArray = keywords
      .split(/[,\n]+/)
      .map((k) => k.trim())
      .filter(Boolean)
    fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seoTitle: title || undefined,
        seoDescription: description || undefined,
        seoKeywords: keywordsArray.length ? keywordsArray : undefined,
      }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(d))
        setMessage({ type: "ok", text: "SEO guardado. Los cambios se reflejarán en el sitio." })
      })
      .catch(() => setMessage({ type: "error", text: "Error al guardar" }))
      .finally(() => setSaving(false))
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-6 h-6 text-sky-600" />
        <h1 className="text-2xl font-bold text-slate-800">SEO editable</h1>
      </div>
      <p className="text-slate-600 mb-8">
        Estos datos se usan en <strong>generateMetadata</strong> del sitio (título, descripción y palabras clave para buscadores).
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título (meta title)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ASANTEC SPA | Tu socio tecnológico..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            maxLength={70}
          />
          <p className="text-xs text-slate-500 mt-1">{title.length}/70 caracteres</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción (meta description)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Más de 10 años ofreciendo hardware..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none"
            maxLength={160}
          />
          <p className="text-xs text-slate-500 mt-1">{description.length}/160 caracteres</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Palabras clave (meta keywords)</label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="tecnología Chile, computadores, hardware, ASANTEC"
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none"
          />
          <p className="text-xs text-slate-500 mt-1">Separadas por coma o salto de línea</p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar SEO
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Volver al panel
          </Link>
        </div>
      </form>
    </div>
  )
}
