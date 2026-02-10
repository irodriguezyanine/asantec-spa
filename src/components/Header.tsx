"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Menu, X, LogIn, Search, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/product"

export function Header({ categories = [] }: { categories?: Category[] }) {
  const cats = categories.length > 0 ? categories : [
    { id: "computadores", name: "Computadores", slug: "computadores" },
    { id: "monitores", name: "Monitores", slug: "monitores" },
    { id: "perifericos", name: "Periféricos", slug: "perifericos" },
    { id: "impresoras", name: "Impresoras", slug: "impresoras" },
    { id: "almacenamiento", name: "Almacenamiento", slug: "almacenamiento" },
    { id: "red-y-conectividad", name: "Red y conectividad", slug: "red-y-conectividad" },
  ]
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="ASANTEC - Volver al inicio">
            {logoError ? (
              <>
                <span className="text-2xl font-bold text-sky-600">ASANTEC</span>
                <span className="text-slate-500 text-sm hidden sm:inline">SPA</span>
              </>
            ) : (
              <Image
                src="/logo.png"
                alt="ASANTEC Servicio y Tecnología"
                width={180}
                height={44}
                className="h-10 w-auto object-contain"
                priority
                unoptimized
                onError={() => setLogoError(true)}
              />
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-700 hover:text-sky-600 font-medium transition">
              Inicio
            </Link>
            <Link href="/catalogo" className="text-slate-700 hover:text-sky-600 font-medium transition">
              Catálogo
            </Link>
            <div className="relative group">
              <button className="text-slate-700 hover:text-sky-600 font-medium transition flex items-center gap-1">
                Categorías
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white rounded-lg shadow-lg border border-slate-200 py-2 min-w-[200px]">
                  {cats.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalogo/${cat.slug}`}
                      className="block px-4 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/nosotros" className="text-slate-700 hover:text-sky-600 font-medium transition">
              Nosotros
            </Link>
            {session ? (
              <Link href="/admin/inventario" className="text-slate-700 hover:text-sky-600 font-medium transition">
                Inventario
              </Link>
            ) : null}
            {!session && (
              <Link href="/contacto" className="text-slate-700 hover:text-sky-600 font-medium transition">
                Contacto
              </Link>
            )}
            {session && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium transition"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            {session ? (
              <Link
                href="/admin"
                className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 flex items-center gap-1.5"
                aria-label="Panel administrador"
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Admin</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
                aria-label="Iniciar sesión como administrador"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Admin</span>
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Menú"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="py-3 border-t border-slate-100">
            <input
              type="search"
              placeholder="Buscar productos..."
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              autoFocus
            />
          </div>
        )}

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all",
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="py-4 flex flex-col gap-2 border-t border-slate-100">
            <Link href="/" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/catalogo" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
              Catálogo
            </Link>
            <span className="py-2 text-slate-500 text-sm font-medium">Categorías</span>
            {cats.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo/${cat.slug}`}
                className="py-2 pl-4 text-slate-600"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/nosotros" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
              Nosotros
            </Link>
            {session ? (
              <Link href="/admin/inventario" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
                Inventario
              </Link>
            ) : null}
            {!session && (
              <Link href="/contacto" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
                Contacto
              </Link>
            )}
            {session && (
              <Link
                href="/admin"
                className="py-2 flex items-center gap-2 text-amber-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
