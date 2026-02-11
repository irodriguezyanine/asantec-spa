"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    // No registrar rutas de admin como visitas públicas
    if (pathname.startsWith("/admin")) return
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page_view", path: pathname }),
    }).catch(() => {})
  }, [pathname])

  return null
}
