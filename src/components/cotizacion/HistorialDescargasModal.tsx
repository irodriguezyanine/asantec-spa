"use client"

import { useState, useEffect } from "react"
import { X, Download, FileText } from "lucide-react"

interface Descarga {
  id: string
  cotizacionId: string
  fechaDescarga: string
}

interface HistorialDescargasModalProps {
  cotizacionId: string
  cotizacionNumero?: string
  onClose: () => void
}

function formatFecha(iso: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  return d.toLocaleString("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function HistorialDescargasModal({
  cotizacionId,
  cotizacionNumero,
  onClose,
}: HistorialDescargasModalProps) {
  const [descargas, setDescargas] = useState<Descarga[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/cotizaciones/${cotizacionId}/descargas`)
        if (res.ok) {
          const data = await res.json()
          setDescargas(data)
        }
      } catch {
        setDescargas([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [cotizacionId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            <h2 className="font-semibold text-slate-800">
              Historial de descargas
              {cotizacionNumero && (
                <span className="ml-2 text-slate-500 font-normal">
                  — Cotización Nº {cotizacionNumero}
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-center text-slate-500 py-8">Cargando...</p>
          ) : descargas.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No hay descargas registradas para esta cotización.
            </p>
          ) : (
            <ul className="space-y-2">
              {descargas.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  <span className="text-sm text-slate-700">
                    {formatFecha(d.fechaDescarga)}
                  </span>
                  <a
                    href={`/api/cotizaciones/${cotizacionId}/descargas/${d.id}/export-pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
          <p className="text-xs text-slate-500">
            Cada vez que descargas el PDF se guarda una copia. Puedes volver a descargar
            versiones anteriores si la cotización fue editada después.
          </p>
        </div>
      </div>
    </div>
  )
}
