import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer"
import type { Cotizacion } from "@/types/cotizacion"

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  // Cabecera solo ASANTEC
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a5f",
  },
  logoAsantec: {
    width: 160,
    height: 50,
    objectFit: "contain",
  },
  // Título principal
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
    color: "#1e3a5f",
    letterSpacing: 1,
  },
  // Bloque cliente + fecha
  headerBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: 170,
    alignItems: "flex-end",
  },
  row: {
    flexDirection: "row",
    marginBottom: 2,
  },
  label: {
    width: 75,
    fontWeight: "bold",
    color: "#334155",
    fontSize: 9,
  },
  value: {
    flex: 1,
    color: "#1e293b",
    fontSize: 9,
  },
  valueRight: {
    textAlign: "right",
    color: "#1e293b",
    fontSize: 9,
  },
  validityBox: {
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 2,
  },
  validityText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#475569",
  },
  // Bloque mensaje cortesía (después de datos)
  messageBlock: {
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f8fafc",
    borderLeftWidth: 4,
    borderLeftColor: "#1e3a5f",
    borderRadius: 2,
    lineHeight: 1.5,
  },
  messageText: {
    fontSize: 9,
    color: "#334155",
    marginBottom: 4,
  },
  messageSignature: {
    marginTop: 6,
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  messageContact: {
    marginTop: 2,
    fontSize: 8,
    color: "#64748b",
  },
  // Tabla
  table: {
    marginTop: 4,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a5f",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontWeight: "bold",
    fontSize: 10,
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  colCantidad: { width: "8%", textAlign: "left" },
  colDescripcion: { width: "48%", textAlign: "left" },
  colDescripcionWide: { width: "57%", textAlign: "left" },
  colUnit: { width: "15%", textAlign: "right" },
  colDesc: { width: "9%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  // Totales
  totalsWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 18,
  },
  totals: {
    width: 220,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#f8fafc",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalLabel: {
    fontWeight: "bold",
    color: "#334155",
    fontSize: 10,
  },
  totalValue: {
    fontWeight: "bold",
    color: "#1e3a5f",
    fontSize: 10,
  },
  totalFinal: {
    borderTopWidth: 1,
    borderTopColor: "#94a3b8",
    marginTop: 4,
    paddingTop: 6,
  },
  totalFinalValue: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#1e3a5f",
  },
  // Footer
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    fontSize: 8,
    lineHeight: 1.5,
    color: "#475569",
  },
  footerSection: {
    marginBottom: 8,
  },
  despachoBox: {
    padding: 10,
    backgroundColor: "#f0f9ff",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#bae6fd",
  },
  despachoTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#0369a1",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  despachoText: {
    fontSize: 9,
    color: "#334155",
    marginBottom: 2,
  },
  footerRef: {
    marginBottom: 6,
  },
  footerInstructions: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
  },
  obsCondicionRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  obsCard: {
    flex: 1,
    minWidth: 180,
    marginRight: 12,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
  },
  obsCardLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  obsCardValue: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.3,
  },
  // Logos partners al final (ancho completo de página)
  partnerLogosSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  partnerLogoWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  partnerLogoLarge: {
    width: 110,
    height: 45,
    objectFit: "contain",
  },
})

export interface CotizacionPdfDocumentProps {
  cotizacion: Cotizacion
  logos?: {
    asantec?: string
    senegocia?: string
    iconstruye?: string
    chilecompra?: string
    chileproveedores?: string
  }
}

function hasValue(s: string | undefined): boolean {
  return typeof s === "string" && s.trim().length > 0
}

export function CotizacionPdfDocument({
  cotizacion,
  logos = {},
}: CotizacionPdfDocumentProps) {
  const { cliente, empresa, items } = cotizacion
  const hasItemDiscount = items.some((i) => (i.descuentoPorcentaje ?? 0) > 0)
  const hasDescuentoTotal = (cotizacion.descuentoTotalPorcentaje ?? 0) > 0
  const hasDespacho =
    cotizacion.despacho?.activo && (cotizacion.despacho.valor ?? 0) > 0
  const formatPrice = (n: number) =>
    n.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const partnerLogos = [
    logos.senegocia,
    logos.iconstruye,
    logos.chilecompra,
    logos.chileproveedores,
  ].filter(Boolean) as string[]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabecera solo ASANTEC */}
        <View style={styles.header}>
          {logos.asantec ? (
            <Image src={logos.asantec} style={styles.logoAsantec} />
          ) : (
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1e3a5f" }}>
                ASANTEC
              </Text>
              <Text style={{ fontSize: 9, color: "#64748b" }}>
                SERVICIO Y TECNOLOGÍA
              </Text>
            </View>
          )}
        </View>

        {/* Título */}
        <Text style={styles.title}>
          COTIZACIÓN Nº {cotizacion.numero.padStart(5, "0")}
        </Text>

        {/* Datos cliente + fecha/validez */}
        <View style={styles.headerBlock}>
          <View style={styles.headerLeft}>
            {hasValue(cliente.empresa) && (
              <View style={styles.row}>
                <Text style={styles.label}>Empresa:</Text>
                <Text style={styles.value}>{cliente.empresa}</Text>
              </View>
            )}
            {hasValue(cliente.rut) && (
              <View style={styles.row}>
                <Text style={styles.label}>Rut:</Text>
                <Text style={styles.value}>{cliente.rut}</Text>
              </View>
            )}
            {hasValue(cliente.contacto) && (
              <View style={styles.row}>
                <Text style={styles.label}>Contacto:</Text>
                <Text style={styles.value}>{cliente.contacto}</Text>
              </View>
            )}
            {hasValue(cliente.mail) && (
              <View style={styles.row}>
                <Text style={styles.label}>Mail:</Text>
                <Text style={styles.value}>{cliente.mail}</Text>
              </View>
            )}
            {hasValue(cliente.fono) && (
              <View style={styles.row}>
                <Text style={styles.label}>Fono:</Text>
                <Text style={styles.value}>{cliente.fono}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.valueRight}>{cotizacion.fecha}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tasa de cambio:</Text>
              <Text style={styles.valueRight}>{cotizacion.tasaCambio}</Text>
            </View>
            <View style={styles.validityBox}>
              <Text style={styles.validityText}>
                Cotización válida por {cotizacion.validezDiasHabiles} días hábiles
              </Text>
            </View>
          </View>
        </View>

        {/* Mensaje de cortesía (después de los datos) */}
        <View style={styles.messageBlock}>
          <Text style={styles.messageText}>{cotizacion.mensajeCortesia}</Text>
          <Text style={styles.messageText}>Saluda cordialmente,</Text>
          <Text style={styles.messageSignature}>{cotizacion.firmaNombre}</Text>
          {(hasValue(empresa.mail) || hasValue(empresa.fono)) && (
            <Text style={styles.messageContact}>
              {hasValue(empresa.mail) && `Mail ${empresa.mail}`}
              {hasValue(empresa.mail) && hasValue(empresa.fono) && " - "}
              {hasValue(empresa.fono) && `Celular ${empresa.fono}`}
            </Text>
          )}
        </View>

        {/* Tabla de items */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colCantidad}>Cantidad</Text>
            <Text style={hasItemDiscount ? styles.colDescripcion : styles.colDescripcionWide}>
              Descripción
            </Text>
            <Text style={styles.colUnit}>Valor Unit. $</Text>
            {hasItemDiscount && <Text style={styles.colDesc}>Desc. %</Text>}
            <Text style={styles.colTotal}>Valor Total $</Text>
          </View>
          {items.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
            >
              <Text style={styles.colCantidad}>{item.cantidad}</Text>
              <Text style={hasItemDiscount ? styles.colDescripcion : styles.colDescripcionWide}>
                {item.descripcion}
              </Text>
              <Text style={styles.colUnit}>{formatPrice(item.valorUnit)}</Text>
              {hasItemDiscount && (
                <Text style={styles.colDesc}>
                  {item.descuentoPorcentaje ? `${item.descuentoPorcentaje}%` : "—"}
                </Text>
              )}
              <Text style={styles.colTotal}>{formatPrice(item.valorTotal)}</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totals}>
            {hasDescuentoTotal && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Descuento total ({cotizacion.descuentoTotalPorcentaje}%)
                </Text>
                <Text style={[styles.totalValue, { color: "#b45309" }]}>
                  -{formatPrice(
                    Math.round(
                      cotizacion.totalNeto *
                        (cotizacion.descuentoTotalPorcentaje! / 100) /
                        (1 - cotizacion.descuentoTotalPorcentaje! / 100)
                    )
                  )}
                </Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Neto $</Text>
              <Text style={styles.totalValue}>
                {formatPrice(cotizacion.totalNeto)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {cotizacion.ivaPorcentaje}% IVA
              </Text>
              <Text style={styles.totalValue}>{formatPrice(cotizacion.iva)}</Text>
            </View>
            {hasDespacho && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Despacho $</Text>
                <Text style={styles.totalValue}>
                  {formatPrice(cotizacion.despacho!.valor)}
                </Text>
              </View>
            )}
            <View style={[styles.totalRow, styles.totalFinal]}>
              <Text style={[styles.totalLabel, styles.totalFinalValue]}>
                Total $
              </Text>
              <Text style={styles.totalFinalValue}>
                {formatPrice(cotizacion.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {cotizacion.despacho?.activo &&
            (hasValue(cotizacion.despacho.item) ||
              hasValue(cotizacion.despacho.direccion) ||
              (cotizacion.despacho.valor ?? 0) > 0) && (
            <View style={[styles.footerSection, styles.despachoBox]}>
              <Text style={styles.despachoTitle}>DESPACHO</Text>
              {hasValue(cotizacion.despacho!.item) && (
                <Text style={styles.despachoText}>Item: {cotizacion.despacho!.item}</Text>
              )}
              {hasValue(cotizacion.despacho!.direccion) && (
                <Text style={styles.despachoText}>Dirección: {cotizacion.despacho!.direccion}</Text>
              )}
              {(cotizacion.despacho!.valor ?? 0) > 0 && (
                <Text style={styles.despachoText}>Valor: {formatPrice(cotizacion.despacho!.valor)}</Text>
              )}
            </View>
          )}
          {hasValue(cotizacion.condicionesDespacho) && (
            <View style={styles.footerSection}>
              <Text>{cotizacion.condicionesDespacho}</Text>
            </View>
          )}
          {hasValue(cotizacion.referencia) && (
            <View style={styles.footerRef}>
              <Text>REF.: {cotizacion.referencia}</Text>
            </View>
          )}
          <View style={styles.footerInstructions}>
            <Text>{cotizacion.instruccionesOrdenCompra}</Text>
          </View>
          <View style={styles.obsCondicionRow}>
            {hasValue(cotizacion.observaciones) && (
              <View style={styles.obsCard}>
                <Text style={styles.obsCardLabel}>OBSERVACIONES</Text>
                <Text style={styles.obsCardValue}>{cotizacion.observaciones}</Text>
              </View>
            )}
            <View style={styles.obsCard}>
              <Text style={styles.obsCardLabel}>CONDICIÓN DE VENTA</Text>
              <Text style={styles.obsCardValue}>{cotizacion.condicionVenta}</Text>
            </View>
          </View>
        </View>

        {/* Logos partners al final - ancho completo */}
        {partnerLogos.length > 0 && (
          <View style={styles.partnerLogosSection}>
            {partnerLogos.map((src, i) => (
              <View key={i} style={styles.partnerLogoWrapper}>
                <Image src={src} style={styles.partnerLogoLarge} />
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
