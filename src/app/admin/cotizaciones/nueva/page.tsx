"use client"

import { useEffect, useState } from "react"
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
  const [cotizacionInicial, setCotizacionInicial] = useState<Partial<Cotizacion> | null>(null)

  useEffect(() => {
    const base: Partial<Cotizacion> = {
      numero: "",
      fecha: new Date().toISOString().slice(0, 10),
      cliente: clienteEmpty,
      items: [],
      totalNeto: 0,
      ivaPorcentaje: COTIZACION_DEFAULTS.ivaPorcentaje,
      iva: 0,
      total: 0,
      tasaCambio: "US$-",
      mostrarTipoCambio: false,
      validezDiasHabiles: COTIZACION_DEFAULTS.validezDiasHabiles,
      empresa: { ...EMPRESA_DEFAULT },
      condicionesDespacho: COTIZACION_DEFAULTS.condicionesDespacho,
      referencia: COTIZACION_DEFAULTS.referencia,
      mensajeCortesia: COTIZACION_DEFAULTS.mensajeCortesia,
      firmaNombre: COTIZACION_DEFAULTS.firmaNombre,
      instruccionesOrdenCompra: COTIZACION_DEFAULTS.instruccionesOrdenCompra,
      observaciones: COTIZACION_DEFAULTS.observaciones,
      condicionVenta: COTIZACION_DEFAULTS.condicionVenta,
    }
    fetch("/api/cotizaciones/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((config) => {
        if (config) {
          setCotizacionInicial({
            ...base,
            condicionesDespacho: config.condicionesDespacho ?? base.condicionesDespacho,
            referencia: config.referencia ?? base.referencia,
            mensajeCortesia: config.mensajeCortesia ?? base.mensajeCortesia,
            firmaNombre: config.firmaNombre ?? base.firmaNombre,
            instruccionesOrdenCompra: config.instruccionesOrdenCompra ?? base.instruccionesOrdenCompra,
            observaciones: config.observaciones ?? base.observaciones,
            condicionVenta: config.condicionVenta ?? base.condicionVenta,
            empresa: {
              ...EMPRESA_DEFAULT,
              contacto: (config.empresaContacto || EMPRESA_DEFAULT.contacto).trim(),
              mail: (config.empresaMail || EMPRESA_DEFAULT.mail).trim(),
              fono: (config.empresaFono || EMPRESA_DEFAULT.fono).trim(),
            },
          })
        } else {
          setCotizacionInicial(base)
        }
      })
      .catch(() => {
        const fallback: Partial<Cotizacion> = {
          numero: "",
          fecha: new Date().toISOString().slice(0, 10),
          cliente: clienteEmpty,
          items: [],
          totalNeto: 0,
          ivaPorcentaje: COTIZACION_DEFAULTS.ivaPorcentaje,
          iva: 0,
          total: 0,
          tasaCambio: "US$-",
          mostrarTipoCambio: false,
          validezDiasHabiles: COTIZACION_DEFAULTS.validezDiasHabiles,
          empresa: { ...EMPRESA_DEFAULT },
          condicionesDespacho: COTIZACION_DEFAULTS.condicionesDespacho,
          referencia: COTIZACION_DEFAULTS.referencia,
          mensajeCortesia: COTIZACION_DEFAULTS.mensajeCortesia,
          firmaNombre: COTIZACION_DEFAULTS.firmaNombre,
          instruccionesOrdenCompra: COTIZACION_DEFAULTS.instruccionesOrdenCompra,
          observaciones: COTIZACION_DEFAULTS.observaciones,
          condicionVenta: COTIZACION_DEFAULTS.condicionVenta,
        }
        setCotizacionInicial(fallback)
      })
  }, [])

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

  if (!cotizacionInicial) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-500">
        Cargando...
      </div>
    )
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
