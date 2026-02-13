"use client"

import { useState, useEffect } from "react"
import { X, Download, FileText } from "lucide-react"

interface CotizacionItemSnapshot {
  cantidad: number
  descripcion: string
  valorUnit: number
}

interface Descarga {
  id: string
  cotizacionId: string
  fechaDescarga: string
  items?: CotizacionItemSnapshot[]
}

interface HistorialDescargasModalProps {
  cotizacionId: string
  cotizacionNumero?: string
  onClose: () => void
}

function formatFechaHora(iso: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(n)
}

function getPrimerItemTexto(items?: CotizacionItemSnapshot[]): string {
  if (!items?.length) return "Sin items"
  const first = items[0]
  const desc = (first?.descripcion || "").trim()
  const truncated = desc.length > 35 ? `${desc.slice(0, 35)}...` : desc || "—"
  return `${first?.cantidad ?? 0} ${truncated}`
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
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[80vh] flex flex-col">
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
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-sm text-slate-600 shrink-0">
                      {formatFechaHora(d.fechaDescarga)}
                    </span>
                    <span className="text-slate-400">—</span>
                    <span className="relative group">
                      <span className="text-sm text-slate-800 font-medium cursor-help underline decoration-dotted decoration-slate-400 underline-offset-2">
                        {getPrimerItemTexto(d.items)}
                      </span>
                      {d.items?.length > 0 && (
                        <div className="absolute left-0 top-full pt-2 z-[60] hidden group-hover:block w-[min(90vw,400px)]">
                          <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-left">
                            <p className="text-xs font-semibold text-slate-600 mb-2 pb-1 border-b border-slate-100">
                              Vista previa de items
                            </p>
                            <div className="max-h-48 overflow-y-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-slate-500 border-b border-slate-100">
                                    <th className="text-left py-1 pr-2 w-10">Cant.</th>
                                    <th className="text-left py-1 pr-2">Descripción</th>
                                    <th className="text-right py-1">Precio</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(d.items || []).map((item, idx) => (
                                    <tr key={idx} className="border-b border-slate-50">
                                      <td className="py-1.5 pr-2">{item.cantidad}</td>
                                      <td className="py-1.5 pr-2">{item.descripcion || "—"}</td>
                                      <td className="py-1.5 text-right font-medium">
                                        {formatPrice(item.valorUnit)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                  <a
                    href={`/api/cotizaciones/${cotizacionId}/descargas/${d.id}/export-pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 text-sm font-medium shrink-0"
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
