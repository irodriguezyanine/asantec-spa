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
  // Cabecera con logos
  headerLogos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a5f",
  },
  logoAsantec: {
    width: 140,
    height: 45,
    objectFit: "contain",
  },
  partnerLogos: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  partnerLogo: {
    width: 50,
    height: 28,
    objectFit: "contain",
  },
  // Título principal
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#1e3a5f",
    letterSpacing: 1,
  },
  // Bloque cliente + fecha
  headerBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: 180,
    alignItems: "flex-end",
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: 85,
    fontWeight: "bold",
    color: "#334155",
  },
  value: {
    flex: 1,
    color: "#1e293b",
  },
  valueRight: {
    textAlign: "right",
    color: "#1e293b",
  },
  validityBox: {
    marginTop: 6,
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
  // Tabla
  table: {
    marginTop: 4,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#94a3b8",
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
  colCantidad: { width: "10%", textAlign: "left" },
  colDescripcion: { width: "55%", textAlign: "left" },
  colUnit: { width: "17%", textAlign: "right" },
  colTotal: { width: "18%", textAlign: "right" },
  // Totales
  totalsWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
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
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    fontSize: 8,
    lineHeight: 1.5,
    color: "#475569",
  },
  footerSection: {
    marginBottom: 10,
  },
  footerBold: {
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
    fontSize: 9,
  },
  footerRef: {
    marginBottom: 8,
  },
  footerMessage: {
    marginBottom: 6,
  },
  footerSignature: {
    marginTop: 8,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  footerInstructions: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 2,
  },
  footerObs: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
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

export function CotizacionPdfDocument({
  cotizacion,
  logos = {},
}: CotizacionPdfDocumentProps) {
  const { cliente, items } = cotizacion
  const formatPrice = (n: number) =>
    n.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabecera con logos */}
        <View style={styles.headerLogos}>
          {logos.asantec ? (
            <Image src={logos.asantec} style={styles.logoAsantec} />
          ) : (
            <View>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1e3a5f" }}>
                ASANTEC
              </Text>
              <Text style={{ fontSize: 8, color: "#64748b" }}>
                SERVICIO Y TECNOLOGÍA
              </Text>
            </View>
          )}
          <View style={styles.partnerLogos}>
            {logos.senegocia && (
              <Image src={logos.senegocia} style={styles.partnerLogo} />
            )}
            {logos.iconstruye && (
              <Image src={logos.iconstruye} style={styles.partnerLogo} />
            )}
            {logos.chilecompra && (
              <Image src={logos.chilecompra} style={styles.partnerLogo} />
            )}
            {logos.chileproveedores && (
              <Image src={logos.chileproveedores} style={styles.partnerLogo} />
            )}
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>
          COTIZACIÓN Nº {cotizacion.numero.padStart(5, "0")}
        </Text>

        {/* Datos cliente + fecha/validez */}
        <View style={styles.headerBlock}>
          <View style={styles.headerLeft}>
            <View style={styles.row}>
              <Text style={styles.label}>Empresa:</Text>
              <Text style={styles.value}>{cliente.empresa || "—"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Rut:</Text>
              <Text style={styles.value}>{cliente.rut || "—"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contacto:</Text>
              <Text style={styles.value}>{cliente.contacto || "—"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mail - Fono</Text>
              <Text style={styles.value}>
                Mail {cliente.mail || "—"} - Celular {cliente.fono || "—"}
              </Text>
            </View>
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

        {/* Tabla de items */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colCantidad}>Cantidad</Text>
            <Text style={styles.colDescripcion}>Descripción</Text>
            <Text style={styles.colUnit}>Valor Unit. $</Text>
            <Text style={styles.colTotal}>Valor Total $</Text>
          </View>
          {items.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : undefined]}
            >
              <Text style={styles.colCantidad}>{item.cantidad}</Text>
              <Text style={styles.colDescripcion}>{item.descripcion}</Text>
              <Text style={styles.colUnit}>{formatPrice(item.valorUnit)}</Text>
              <Text style={styles.colTotal}>{formatPrice(item.valorTotal)}</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totals}>
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
          {cotizacion.condicionesDespacho ? (
            <View style={styles.footerSection}>
              <Text>{cotizacion.condicionesDespacho}</Text>
            </View>
          ) : null}
          <View style={styles.footerRef}>
            <Text>REF.: {cotizacion.referencia}</Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerBold}>
              COTIZACIÓN Nº {cotizacion.numero.padStart(5, "0")}
            </Text>
            <Text style={styles.footerMessage}>{cotizacion.mensajeCortesia}</Text>
            <Text>Saluda cordialmente,</Text>
            <Text style={styles.footerSignature}>{cotizacion.firmaNombre}</Text>
          </View>
          <View style={styles.footerInstructions}>
            <Text>{cotizacion.instruccionesOrdenCompra}</Text>
          </View>
          <View style={styles.footerObs}>
            <Text>OBS.: {cotizacion.observaciones}</Text>
            <Text>CONDICIÓN DE VENTA: {cotizacion.condicionVenta}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
