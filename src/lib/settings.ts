const API_BASE = typeof window !== "undefined" ? "" : process.env.NEXTAUTH_URL || "http://localhost:3000"

export async function getHidePrices(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, { next: { revalidate: 30 } })
    if (!res.ok) return false
    const data = await res.json()
    return data.hidePrices === true
  } catch {
    return false
  }
}
