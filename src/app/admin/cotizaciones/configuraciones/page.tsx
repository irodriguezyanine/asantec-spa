"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Save, Settings } from "lucide-react"

interface CotizacionConfig {
  condicionesDespacho: string
  referencia: string
  mensajeCortesia: string
  firmaNombre: string
  empresaContacto: string
  empresaMail: string
  empresaFono: string
  instruccionesOrdenCompra: string
  observaciones: string
  condicionVenta: string
}

export default function ConfiguracionesCotizacionPage() {
  const [config, setConfig] = useState<CotizacionConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function loadConfig() {
    const res = await fetch("/api/cotizaciones/config")
    if (res.ok) {
      const data = await res.json()
      setConfig(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadConfig()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!config) return
    setSaving(true)
    try {
      const res = await fetch("/api/cotizaciones/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (res.ok) {
        alert("Configuración guardada correctamente")
      } else {
        const err = await res.json()
        alert(err.error || "Error al guardar")
      }
    } catch {
      alert("Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  if (loading || !config) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-500">
        Cargando configuración...
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-sky-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Configuraciones de la Cotización
          </h1>
          <p className="text-slate-600 text-sm">
            Edita los textos que aparecen por defecto en las cotizaciones
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">
            Mensaje de cortesía y firma
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mensaje de cortesía
              </label>
              <textarea
                value={config.mensajeCortesia}
                onChange={(e) =>
                  setConfig((c) => ({ ...c!, mensajeCortesia: e.target.value }))
                }
                rows={4}
                placeholder="Estimado Cliente: Asantec agradece su preferencia..."
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre de firma
              </label>
              <input
                type="text"
                value={config.firmaNombre}
                onChange={(e) =>
                  setConfig((c) => ({ ...c!, firmaNombre: e.target.value }))
                }
                placeholder="Jorge Rodriguez Bonilla"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre de contacto (empresa)
              </label>
              <input
                type="text"
                value={config.empresaContacto}
                onChange={(e) =>
                  setConfig((c) => ({ ...c!, empresaContacto: e.target.value }))
                }
                placeholder="Jorge Rodriguez Bonilla"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email de contacto
                </label>
                <input
                  type="email"
                  value={config.empresaMail}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c!, empresaMail: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Teléfono de contacto
                </label>
                <input
                  type="text"
                  value={config.empresaFono}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c!, empresaFono: e.target.value }))
                  }
                  placeholder="+569 9866 1395"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">
            Condiciones e instrucciones
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Condiciones de despacho
              </label>
              <textarea
                value={config.condicionesDespacho}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c!,
                    condicionesDespacho: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Referencia (REF.)
              </label>
              <input
                type="text"
                value={config.referencia}
                onChange={(e) =>
                  setConfig((c) => ({ ...c!, referencia: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Instrucciones Orden de Compra
              </label>
              <textarea
                value={config.instruccionesOrdenCompra}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c!,
                    instruccionesOrdenCompra: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Observaciones
              </label>
              <input
                type="text"
                value={config.observaciones}
                onChange={(e) =>
                  setConfig((c) => ({ ...c!, observaciones: e.target.value }))
                }
                placeholder="Cotización válida por 2 días hábiles."
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Condición de venta
              </label>
              <input
                type="text"
                value={config.condicionVenta}
                onChange={(e) =>
                  setConfig((c) => ({ ...c!, condicionVenta: e.target.value }))
                }
                placeholder="CONTADO"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 transition"
          >
            <Save className="w-5 h-5" />
            {saving ? "Guardando..." : "Guardar configuración"}
          </button>
          <Link
            href="/admin/cotizaciones"
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            Cancelar
          </Link>
        </div>
      </form>

      <p className="mt-6">
        <Link href="/admin/cotizaciones" className="text-sky-600 hover:underline">
          ← Volver a cotizaciones
        </Link>
      </p>
    </div>
  )
}
