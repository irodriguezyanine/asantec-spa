"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Menu, X, ChevronDown, Home, Package, FolderTree, Search, BarChart3, Globe, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Inicio", icon: Home },
  { href: "/admin/inventario", label: "Inventario", icon: FolderTree },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/analytics", label: "Analíticas", icon: BarChart3 },
  { href: "/", label: "Ver sitio", icon: Globe },
]

export function AdminNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [menuOpen])

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/admin"
            className="font-bold text-slate-800 shrink-0 text-sm sm:text-base truncate"
          >
            Panel Admin ASANTEC
          </Link>

          {/* Desktop: navegación horizontal */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-4">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm whitespace-nowrap transition",
                  pathname === href
                    ? "text-sky-600 font-medium"
                    : "text-slate-600 hover:text-sky-600"
                )}
              >
                {label}
              </Link>
            ))}
            <a
              href="/api/auth/signout"
              className="text-sm text-slate-600 hover:text-red-600 whitespace-nowrap transition"
            >
              Cerrar sesión
            </a>
          </nav>

          {/* Móvil: botón que abre lista desplegable */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  <span className="text-sm font-medium">Menú</span>
                </>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-slate-200 bg-white shadow-lg py-2 z-50">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 text-sm transition",
                      pathname === href
                        ? "bg-sky-50 text-sky-700 font-medium"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                ))}
                <div className="border-t border-slate-100 my-2" />
                <a
                  href="/api/auth/signout"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Cerrar sesión
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
