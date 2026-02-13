"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Plus, Trash2, Download, Save, ChevronDown, ChevronUp, Package, History } from "lucide-react"
import type { Cotizacion, CotizacionItem, CotizacionCliente, CotizacionEmpresa } from "@/types/cotizacion"
import { EMPRESA_DEFAULT, COTIZACION_DEFAULTS } from "@/types/cotizacion"
import type { Product } from "@/types/product"
import { ClienteAutocomplete } from "./ClienteAutocomplete"
import { HistorialDescargasModal } from "./HistorialDescargasModal"

interface CotizacionEditorProps {
  cotizacion: Partial<Cotizacion>
  onSave: (data: Partial<Cotizacion>) => Promise<void>
  onCancel: () => void
  isNew?: boolean
  cotizacionId?: string
}

function generateId() {
  return crypto.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function CotizacionEditor({
  cotizacion: initial,
  onSave,
  onCancel,
  isNew,
  cotizacionId,
}: CotizacionEditorProps) {
  const [numero, setNumero] = useState(initial.numero ?? "")
  const [fecha, setFecha] = useState(initial.fecha ?? "")
  const [cliente, setCliente] = useState<CotizacionCliente>(
    initial.cliente ?? { empresa: "", rut: "", contacto: "", mail: "", fono: "" }
  )
  const [items, setItems] = useState<CotizacionItem[]>(
    initial.items?.length ? [...initial.items] : []
  )
  const [ivaPorcentaje, setIvaPorcentaje] = useState(initial.ivaPorcentaje ?? 19)
  const [tasaCambio, setTasaCambio] = useState(initial.tasaCambio ?? "US$-")
  const [validezDiasHabiles, setValidezDiasHabiles] = useState(
    initial.validezDiasHabiles ?? 2
  )
  const [empresa, setEmpresa] = useState<CotizacionEmpresa>(
    initial.empresa ?? EMPRESA_DEFAULT
  )
  const [condicionesDespacho, setCondicionesDespacho] = useState(
    initial.condicionesDespacho ?? COTIZACION_DEFAULTS.condicionesDespacho
  )
  const [referencia, setReferencia] = useState(
    initial.referencia ?? COTIZACION_DEFAULTS.referencia
  )
  const [mensajeCortesia, setMensajeCortesia] = useState(
    initial.mensajeCortesia ?? COTIZACION_DEFAULTS.mensajeCortesia
  )
  const [firmaNombre, setFirmaNombre] = useState(
    initial.firmaNombre ?? COTIZACION_DEFAULTS.firmaNombre
  )
  const [instruccionesOrdenCompra, setInstruccionesOrdenCompra] = useState(
    initial.instruccionesOrdenCompra ?? COTIZACION_DEFAULTS.instruccionesOrdenCompra
  )
  const [observaciones, setObservaciones] = useState(
    initial.observaciones ?? COTIZACION_DEFAULTS.observaciones
  )
  const [condicionVenta, setCondicionVenta] = useState(
    initial.condicionVenta ?? COTIZACION_DEFAULTS.condicionVenta
  )
  const [showCliente, setShowCliente] = useState(true)
  const [showItems, setShowItems] = useState(true)
  const [showEmpresa, setShowEmpresa] = useState(false)
  const [showCondiciones, setShowCondiciones] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showProductPicker, setShowProductPicker] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [clienteSelectedFromList, setClienteSelectedFromList] = useState(false)
  const [showHistorialDropdown, setShowHistorialDropdown] = useState(false)
  const [historialCotizaciones, setHistorialCotizaciones] = useState<Cotizacion[]>([])
  const [loadingHistorial, setLoadingHistorial] = useState(false)
  const [showHistorialDescargas, setShowHistorialDescargas] = useState(false)
  const historialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showProductPicker) {
      fetch("/api/products?admin=true")
        .then((r) => r.ok ? r.json() : [])
        .then(setProducts)
    }
  }, [showProductPicker])

  const totalNeto = items.reduce((s, i) => s + i.valorTotal, 0)
  const iva = Math.round(totalNeto * (ivaPorcentaje / 100))
  const total = totalNeto + iva

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        cantidad: 1,
        descripcion: "",
        valorUnit: 0,
        valorTotal: 0,
      },
    ])
  }

  function updateItem(id: string, field: keyof CotizacionItem, value: string | number) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it
        const next = { ...it, [field]: value }
        if (field === "cantidad" || field === "valorUnit") {
          next.valorTotal =
            (typeof next.cantidad === "number" ? next.cantidad : 1) *
            (typeof next.valorUnit === "number" ? next.valorUnit : 0)
        }
        return next
      })
    )
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  async function loadHistorial() {
    if (!cliente.empresa?.trim() && !cliente.rut?.trim()) return
    setLoadingHistorial(true)
    try {
      const params = new URLSearchParams({ historial: "true" })
      if (cliente.empresa?.trim()) params.set("empresa", cliente.empresa.trim())
      if (cliente.rut?.trim()) params.set("rut", cliente.rut.trim())
      const res = await fetch(`/api/cotizaciones?${params}`)
      if (res.ok) {
        const data = await res.json()
        setHistorialCotizaciones(data)
        setShowHistorialDropdown(true)
      }
    } catch {
      setHistorialCotizaciones([])
    } finally {
      setLoadingHistorial(false)
    }
  }

  function aplicarCotizacionAnterior(c: Cotizacion) {
    if (c.items?.length) {
      setItems(
        c.items.map((i) => ({
          ...i,
          id: generateId(),
          valorTotal: i.cantidad * i.valorUnit,
        }))
      )
    }
    setShowHistorialDropdown(false)
  }

  useEffect(() => {
    function handleClickOutsideHistorial(e: MouseEvent) {
      if (historialRef.current && !historialRef.current.contains(e.target as Node)) {
        setShowHistorialDropdown(false)
      }
    }
    if (showHistorialDropdown) {
      document.addEventListener("mousedown", handleClickOutsideHistorial)
      return () => document.removeEventListener("mousedown", handleClickOutsideHistorial)
    }
  }, [showHistorialDropdown])

  function addProductFromCatalog(p: Product) {
    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        cantidad: 1,
        descripcion: p.name,
        valorUnit: p.price,
        valorTotal: p.price,
      },
    ])
    setShowProductPicker(false)
    setProductSearch("")
  }

  const filteredProducts = products.filter(
    (p) =>
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(productSearch.toLowerCase())
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const itemsWithTotals = items.map((i) => ({
        ...i,
        valorTotal: i.cantidad * i.valorUnit,
      }))
      await onSave({
        numero,
        fecha,
        cliente,
        items: itemsWithTotals,
        totalNeto,
        ivaPorcentaje,
        iva,
        total,
        tasaCambio,
        validezDiasHabiles,
        empresa,
        condicionesDespacho,
        referencia,
        mensajeCortesia,
        firmaNombre,
        instruccionesOrdenCompra,
        observaciones,
        condicionVenta,
      })
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (n: number) =>
    n.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos del cliente */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowCliente(!showCliente)}
          className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition"
        >
          <h2 className="font-semibold text-slate-800">Datos del cliente</h2>
          {showCliente ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>
        {showCliente && (
          <div className="p-6">
            <ClienteAutocomplete
              value={cliente}
              onChange={setCliente}
              onClienteSelectedFromList={() => setClienteSelectedFromList(true)}
              onClienteManuallyChanged={() => setClienteSelectedFromList(false)}
            />
          </div>
        )}
      </section>

      {/* Historial de licitaciones - solo si cliente fue seleccionado de la lista */}
      {clienteSelectedFromList && (cliente.empresa?.trim() || cliente.rut?.trim()) && (
        <div ref={historialRef} className="relative">
          <button
            type="button"
            onClick={loadHistorial}
            disabled={loadingHistorial}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/50 text-sky-700 font-medium hover:bg-sky-100 hover:border-sky-400 transition disabled:opacity-50"
          >
            <History className="w-5 h-5" />
            {loadingHistorial ? "Cargando..." : "Historial de licitaciones"}
          </button>
          {showHistorialDropdown && historialCotizaciones.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              <div className="p-2 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-medium text-slate-600">
                  Últimas 5 cotizaciones (clic para copiar items)
                </p>
              </div>
              <ul className="max-h-64 overflow-y-auto py-1">
                {historialCotizaciones.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => aplicarCotizacionAnterior(c)}
                      className="w-full text-left px-4 py-3 hover:bg-sky-50 transition flex justify-between items-center"
                    >
                      <span className="font-medium text-slate-800">
                        Nº {c.numero} — {c.fecha}
                      </span>
                      <span className="text-sm text-sky-600 font-semibold">
                        ${c.total?.toLocaleString("es-CL")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showHistorialDropdown && historialCotizaciones.length === 0 && !loadingHistorial && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center text-slate-500 text-sm">
              No hay cotizaciones anteriores para este cliente
            </div>
          )}
        </div>
      )}

      {/* Número, fecha y parámetros */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nº Cotización
            </label>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Auto (nueva)"
              disabled={isNew}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tasa de cambio
            </label>
            <input
              type="text"
              value={tasaCambio}
              onChange={(e) => setTasaCambio(e.target.value)}
              placeholder="US$-"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Válida por (días hábiles)
            </label>
            <input
              type="number"
              min={1}
              value={validezDiasHabiles}
              onChange={(e) =>
                setValidezDiasHabiles(parseInt(e.target.value, 10) || 2)
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowItems(!showItems)}
          className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition"
        >
          <h2 className="font-semibold text-slate-800">Items de la cotización</h2>
          {showItems ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>
        {showItems && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-2 w-20">Cant.</th>
                    <th className="text-left py-2 pr-2">Descripción</th>
                    <th className="text-right py-2 pr-2 w-28">Valor Unit. $</th>
                    <th className="text-right py-2 pr-2 w-28">Total $</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          min={1}
                          value={item.cantidad}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "cantidad",
                              parseInt(e.target.value, 10) || 1
                            )
                          }
                          className="w-16 px-2 py-1 rounded border border-slate-300"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) =>
                            updateItem(item.id, "descripcion", e.target.value)
                          }
                          placeholder="Descripción del producto"
                          className="w-full px-2 py-1 rounded border border-slate-300"
                        />
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={
                            item.valorUnit
                              ? formatPrice(item.valorUnit)
                              : ""
                          }
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "")
                            updateItem(item.id, "valorUnit", parseInt(raw, 10) || 0)
                          }}
                          className="w-full text-right px-2 py-1 rounded border border-slate-300"
                        />
                      </td>
                      <td className="py-2 pr-2 text-right font-medium">
                        {formatPrice(item.cantidad * item.valorUnit)}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Agregar item manual
              </button>
              <button
                type="button"
                onClick={() => setShowProductPicker(true)}
                className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
              >
                <Package className="w-4 h-4" />
                Agregar desde catálogo
              </button>
            </div>
            {showProductPicker && (
              <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-800">Seleccionar producto</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductPicker(false)
                      setProductSearch("")
                    }}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Cerrar
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredProducts.slice(0, 20).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addProductFromCatalog(p)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition text-sm"
                    >
                      <span className="font-medium text-slate-800">{p.name}</span>
                      <span className="ml-2 text-slate-500">
                        ${p.price.toLocaleString("es-CL")}
                      </span>
                    </button>
                  ))}
                  {filteredProducts.length === 0 && (
                    <p className="text-sm text-slate-500 py-2">
                      No hay productos. Agrega items manualmente.
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-6 text-sm">
              <span>
                Total Neto: <strong>{formatPrice(totalNeto)}</strong>
              </span>
              <span>
                IVA ({ivaPorcentaje}%): <strong>{formatPrice(iva)}</strong>
              </span>
              <span>
                Total: <strong>{formatPrice(total)}</strong>
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="text-sm text-slate-600">IVA %:</label>
              <input
                type="number"
                min={0}
                max={100}
                value={ivaPorcentaje}
                onChange={(e) =>
                  setIvaPorcentaje(parseInt(e.target.value, 10) || 0)
                }
                className="w-16 px-2 py-1 rounded border border-slate-300"
              />
            </div>
          </div>
        )}
      </section>

      {/* Datos de la empresa (Asantec) */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowEmpresa(!showEmpresa)}
          className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition"
        >
          <h2 className="font-semibold text-slate-800">Datos de la empresa (emisor)</h2>
          {showEmpresa ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>
        {showEmpresa && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={empresa.nombre}
                onChange={(e) =>
                  setEmpresa((em) => ({ ...em, nombre: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                RUT
              </label>
              <input
                type="text"
                value={empresa.rut}
                onChange={(e) =>
                  setEmpresa((em) => ({ ...em, rut: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contacto
              </label>
              <input
                type="text"
                value={empresa.contacto}
                onChange={(e) =>
                  setEmpresa((em) => ({ ...em, contacto: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={empresa.direccion}
                onChange={(e) =>
                  setEmpresa((em) => ({ ...em, direccion: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={empresa.mail}
                onChange={(e) =>
                  setEmpresa((em) => ({ ...em, mail: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={empresa.fono}
                onChange={(e) =>
                  setEmpresa((em) => ({ ...em, fono: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        )}
      </section>

      {/* Condiciones y textos */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowCondiciones(!showCondiciones)}
          className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition"
        >
          <h2 className="font-semibold text-slate-800">Condiciones y textos</h2>
          {showCondiciones ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>
        {showCondiciones && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Condiciones de despacho
              </label>
              <textarea
                value={condicionesDespacho}
                onChange={(e) => setCondicionesDespacho(e.target.value)}
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
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mensaje de cortesía
              </label>
              <textarea
                value={mensajeCortesia}
                onChange={(e) => setMensajeCortesia(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre de firma
              </label>
              <input
                type="text"
                value={firmaNombre}
                onChange={(e) => setFirmaNombre(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Instrucciones Orden de Compra
              </label>
              <textarea
                value={instruccionesOrdenCompra}
                onChange={(e) => setInstruccionesOrdenCompra(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Observaciones
              </label>
              <input
                type="text"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Condición de venta
              </label>
              <input
                type="text"
                value={condicionVenta}
                onChange={(e) => setCondicionVenta(e.target.value)}
                placeholder="CONTADO"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        )}
      </section>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 transition"
        >
          <Save className="w-5 h-5" />
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
        >
          Cancelar
        </button>
        {!isNew && cotizacionId && (
          <>
            <a
              href={`/api/cotizaciones/${cotizacionId}/export-pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
            >
              <Download className="w-5 h-5" />
              Descargar PDF
            </a>
            <button
              type="button"
              onClick={() => setShowHistorialDescargas(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
            >
              <History className="w-5 h-5" />
              Historial descargas
            </button>
          </>
        )}
        <Link
          href="/admin/cotizaciones"
          className="text-sky-600 hover:underline"
        >
          ← Volver a cotizaciones
        </Link>
      </div>

      {showHistorialDescargas && cotizacionId && (
        <HistorialDescargasModal
          cotizacionId={cotizacionId}
          cotizacionNumero={numero}
          onClose={() => setShowHistorialDescargas(false)}
        />
      )}
    </form>
  )
}
