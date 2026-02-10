"use client"

import { useEffect, useState } from "react"
import { DollarSign, EyeOff } from "lucide-react"

export function PriceVisibilityToggle() {
  const [hidePrices, setHidePrices] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setHidePrices(d.hidePrices === true))
      .catch(() => {})
  }, [])

  async function toggle() {
    setLoading(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidePrices: !hidePrices }),
      })
      if (res.ok) {
        const data = await res.json()
        setHidePrices(data.hidePrices)
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm font-medium transition ${
        hidePrices ? "text-amber-600 hover:text-amber-700" : "text-slate-600 hover:text-sky-600"
      }`}
      title={hidePrices ? "Precios ocultos. Clic para mostrar." : "Precios visibles. Clic para ocultar."}
    >
      {hidePrices ? (
        <>
          <EyeOff className="w-4 h-4" />
          <span className="hidden sm:inline">Mostrar precios</span>
        </>
      ) : (
        <>
          <DollarSign className="w-4 h-4" />
          <span className="hidden sm:inline">Ocultar precios</span>
        </>
      )}
    </button>
  )
}
