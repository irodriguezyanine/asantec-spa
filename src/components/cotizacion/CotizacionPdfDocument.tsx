import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"
import type { Cotizacion } from "@/types/cotizacion"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 120,
    fontWeight: "bold",
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    padding: 6,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  colCantidad: { width: "8%" },
  colDescripcion: { width: "62%" },
  colUnit: { width: "15%" },
  colTotal: { width: "15%" },
  totals: {
    marginTop: 10,
    alignItems: "flex-end",
    width: "40%",
    alignSelf: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 4,
  },
  totalLabel: {
    fontWeight: "bold",
    marginRight: 20,
  },
  footer: {
    marginTop: 25,
    fontSize: 8,
    lineHeight: 1.4,
  },
  footerSection: {
    marginBottom: 10,
  },
  footerBold: {
    fontWeight: "bold",
    marginBottom: 4,
  },
})

interface CotizacionPdfDocumentProps {
  cotizacion: Cotizacion
}

export function CotizacionPdfDocument({ cotizacion }: CotizacionPdfDocumentProps) {
  const { cliente, empresa, items } = cotizacion
  const formatPrice = (n: number) =>
    n.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>COTIZACIÓN Nº {cotizacion.numero}</Text>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.row}>
              <Text style={styles.label}>Empresa:</Text>
              <Text style={styles.value}>{cliente.empresa}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Rut:</Text>
              <Text style={styles.value}>{cliente.rut}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contacto:</Text>
              <Text style={styles.value}>{cliente.contacto}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mail - Fono</Text>
              <Text style={styles.value}>
                Mail {cliente.mail} - Celular {cliente.fono}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.value}>{cotizacion.fecha}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tasa de cambio:</Text>
              <Text style={styles.value}>{cotizacion.tasaCambio}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.value}>
                Cotización válida por {cotizacion.validezDiasHabiles} días hábiles
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colCantidad}>Cantidad</Text>
            <Text style={styles.colDescripcion}>Descripción</Text>
            <Text style={styles.colUnit}>Valor Unit. $</Text>
            <Text style={styles.colTotal}>Valor Total $</Text>
          </View>
          {items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colCantidad}>{item.cantidad}</Text>
              <Text style={styles.colDescripcion}>{item.descripcion}</Text>
              <Text style={styles.colUnit}>{formatPrice(item.valorUnit)}</Text>
              <Text style={styles.colTotal}>{formatPrice(item.valorTotal)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Neto $</Text>
            <Text>{formatPrice(cotizacion.totalNeto)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{cotizacion.ivaPorcentaje}% IVA</Text>
            <Text>{formatPrice(cotizacion.iva)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total $</Text>
            <Text>{formatPrice(cotizacion.total)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          {cotizacion.condicionesDespacho ? (
            <View style={styles.footerSection}>
              <Text>{cotizacion.condicionesDespacho}</Text>
            </View>
          ) : null}
          <View style={styles.footerSection}>
            <Text>REF.: {cotizacion.referencia}</Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerBold}>COTIZACIÓN Nº {cotizacion.numero}</Text>
            <Text>{cotizacion.mensajeCortesia}</Text>
            <Text style={{ marginTop: 6 }}>Saluda cordialmente,</Text>
            <Text style={{ fontWeight: "bold" }}>{cotizacion.firmaNombre}</Text>
          </View>
          <View style={styles.footerSection}>
            <Text>{cotizacion.instruccionesOrdenCompra}</Text>
          </View>
          <View style={styles.footerSection}>
            <Text>OBS.: {cotizacion.observaciones}</Text>
            <Text>CONDICIÓN DE VENTA: {cotizacion.condicionVenta}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
