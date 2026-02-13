"use client"

import { useRouter } from "next/navigation"
import { CotizacionEditor } from "@/components/cotizacion/CotizacionEditor"
import { EMPRESA_DEFAULT, COTIZACION_DEFAULTS } from "@/types/cotizacion"
import type { Cotizacion, CotizacionCliente } from "@/types/cotizacion"

const clienteEmpty: CotizacionCliente = {
  empresa: "",
  rut: "",
  contacto: "",
  mail: "",
  fono: "",
}

export default function NuevaCotizacionPage() {
  const router = useRouter()

  const cotizacionInicial: Partial<Cotizacion> = {
    numero: "",
    fecha: new Date().toISOString().slice(0, 10),
    cliente: clienteEmpty,
    items: [],
    totalNeto: 0,
    ivaPorcentaje: COTIZACION_DEFAULTS.ivaPorcentaje,
    iva: 0,
    total: 0,
    tasaCambio: "US$-",
    validezDiasHabiles: COTIZACION_DEFAULTS.validezDiasHabiles,
    empresa: EMPRESA_DEFAULT,
    condicionesDespacho: COTIZACION_DEFAULTS.condicionesDespacho,
    referencia: COTIZACION_DEFAULTS.referencia,
    mensajeCortesia: COTIZACION_DEFAULTS.mensajeCortesia,
    firmaNombre: COTIZACION_DEFAULTS.firmaNombre,
    instruccionesOrdenCompra: COTIZACION_DEFAULTS.instruccionesOrdenCompra,
    observaciones: COTIZACION_DEFAULTS.observaciones,
    condicionVenta: COTIZACION_DEFAULTS.condicionVenta,
  }

  async function handleSave(data: Partial<Cotizacion>) {
    const res = await fetch("/api/cotizaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Error al guardar")
    }
    const saved = await res.json()
    router.push(`/admin/cotizaciones/${saved.id}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Nueva cotización</h1>
      <CotizacionEditor
        cotizacion={cotizacionInicial}
        onSave={handleSave}
        onCancel={() => router.push("/admin/cotizaciones")}
        isNew
      />
    </div>
  )
}
