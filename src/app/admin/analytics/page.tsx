"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, MousePointer, TrendingUp, Loader2, ArrowLeft } from "lucide-react"
import { BarChart, BarList, Card } from "@tremor/react"

interface DayStat {
  date: string
  visitas: number
}

interface ProductStat {
  productId: string | null
  productName: string
  slug: string
  count: number
}

export default function AdminAnalyticsPage() {
  const [visitsByDay, setVisitsByDay] = useState<DayStat[]>([])
  const [topProducts, setTopProducts] = useState<ProductStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics/stats")
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado")
        return res.json()
      })
      .then((data) => {
        setVisitsByDay(data.visitsByDay ?? [])
        setTopProducts(data.topProducts ?? [])
      })
      .catch(() => {
        setVisitsByDay([])
        setTopProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando analíticas...
      </div>
    )
  }

  const barListData = topProducts.map((p) => ({
    name: p.productName,
    value: p.count,
    href: p.slug ? `/producto/${p.slug}` : undefined,
  }))

  const chartTooltip = (props: { payload?: unknown[]; active?: boolean; label?: string }) => {
    const { payload, active, label } = props
    if (!active || !payload?.length) return null
    const item = payload[0] as { value?: string | number | (string | number)[] } | undefined
    const raw = item?.value
    const value = typeof raw === "number" ? raw : Array.isArray(raw) ? Number(raw[0]) : Number(raw) || 0
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-sm text-slate-600">
          Visitas: <span className="font-semibold text-slate-900">{value}</span>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-sky-600" />
        <h1 className="text-2xl font-bold text-slate-800">Analíticas</h1>
      </div>
      <p className="text-slate-600 mb-8">
        Visitas del sitio y productos más clickeados (últimos 30 días). Los datos se registran al cargar una página o al hacer clic en un producto.
      </p>

      <div className="space-y-8">
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-slate-800">Visitas totales por día</h2>
          </div>
          {visitsByDay.length === 0 ? (
            <p className="text-slate-500 py-8 text-center">Aún no hay visitas registradas.</p>
          ) : (
            <BarChart
              data={visitsByDay}
              index="date"
              categories={["visitas"]}
              colors={["sky"]}
              showLegend={false}
              valueFormatter={(v: number) => String(v)}
              yAxisLabel="Visitas"
              yAxisWidth={36}
              customTooltip={chartTooltip as never}
              className="h-72"
            />
          )}
        </Card>

        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MousePointer className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-slate-800">Top 5 productos más clickeados</h2>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-slate-500 py-8 text-center">Aún no hay clics en productos.</p>
          ) : (
            <BarList data={barListData} className="mt-2" valueFormatter={(v: number) => `${v} clics`} />
          )}
        </Card>
      </div>

      <p className="mt-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sky-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al panel
        </Link>
      </p>
    </div>
  )
}
