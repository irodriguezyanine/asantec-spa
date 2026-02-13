/**
 * Tipos para el módulo de cotizaciones ASANTEC
 * Basado en formato de cotización tipo VEDISA
 */

export interface CotizacionItem {
  id: string
  cantidad: number
  descripcion: string
  valorUnit: number
  valorTotal: number
}

export interface CotizacionCliente {
  empresa: string
  rut: string
  contacto: string
  mail: string
  fono: string
}

export interface CotizacionEmpresa {
  nombre: string
  rut: string
  direccion: string
  contacto: string
  mail: string
  fono: string
}

export interface Cotizacion {
  id: string
  numero: string
  fecha: string
  cliente: CotizacionCliente
  items: CotizacionItem[]
  totalNeto: number
  ivaPorcentaje: number
  iva: number
  total: number
  tasaCambio: string
  validezDiasHabiles: number
  empresa: CotizacionEmpresa
  condicionesDespacho: string
  referencia: string
  mensajeCortesia: string
  firmaNombre: string
  instruccionesOrdenCompra: string
  observaciones: string
  condicionVenta: string
  createdAt?: string
  updatedAt?: string
}

export const EMPRESA_DEFAULT: CotizacionEmpresa = {
  nombre: "ASANTEC SPA",
  rut: "77.049.610-1",
  direccion: "Av. Francisco Bilbao N°3771 Oficina 402, Providencia",
  contacto: "Jorge Rodriguez Bonilla",
  mail: "jorge.rodriguez@asantec.cl",
  fono: "+569 9866 1395",
}

export const COTIZACION_DEFAULTS = {
  ivaPorcentaje: 19,
  validezDiasHabiles: 2,
  condicionVenta: "CONTADO",
  condicionesDespacho:
    "Productos con despacho en la RM de 48hrs. hábiles desde la recepción de Orden de Compra. Costos de despacho incluidos.",
  referencia: "Solicitud vía email",
  mensajeCortesia:
    "Estimado Cliente: Asantec agradece su preferencia. Para gestión de solicitudes y OC informamos que nuestros horarios de atención son de 09.00 a 18.00hrs. de Lunes a Viernes, horario continuo.",
  firmaNombre: "Jorge Rodriguez Bonilla",
  instruccionesOrdenCompra:
    "Si Usted acepta la presente Cotización y los Términos y Condiciones Generales de Asantec SPA, favor extender Orden de Compra a: ASANTEC SPA - Rut 77.049.610-1 - Av. Francisco Bilbao N°3771 Oficina 402, Providencia",
  observaciones: "Cotización válida por 2 días hábiles.",
}
