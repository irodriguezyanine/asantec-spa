"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { FolderTree, FileText, BarChart3, Users, LogOut } from "lucide-react"

export function AdminDashboardCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/admin/inventario"
        className="block p-6 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition"
      >
        <FolderTree className="w-8 h-8 text-sky-600" />
        <h2 className="font-semibold text-slate-800 mt-2">Inventario</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gestionar stock, categorías y disponibilidad de productos.
        </p>
      </Link>

      <Link
        href="/admin/cotizaciones"
        className="block p-6 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition"
      >
        <FileText className="w-8 h-8 text-sky-600" />
        <h2 className="font-semibold text-slate-800 mt-2">Cotizaciones</h2>
        <p className="text-sm text-slate-500 mt-1">
          Crear, editar y descargar cotizaciones en PDF.
        </p>
      </Link>

      <Link
        href="/admin/analytics"
        className="block p-6 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition"
      >
        <BarChart3 className="w-8 h-8 text-sky-600" />
        <h2 className="font-semibold text-slate-800 mt-2">Datos página</h2>
        <p className="text-sm text-slate-500 mt-1">
          Visitas por día y productos más clickeados. Dashboard con gráficos.
        </p>
      </Link>

      <Link
        href="/admin/nosotros"
        className="block p-6 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition"
      >
        <Users className="w-8 h-8 text-sky-600" />
        <h2 className="font-semibold text-slate-800 mt-2">Editar Nosotros</h2>
        <p className="text-sm text-slate-500 mt-1">
          Editar todos los textos de la sección Nosotros de la página.
        </p>
      </Link>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="block w-full p-6 rounded-xl bg-white border border-slate-200 hover:border-red-200 hover:shadow-md transition text-left"
      >
        <LogOut className="w-8 h-8 text-red-600" />
        <h2 className="font-semibold text-slate-800 mt-2">Cerrar sesión</h2>
        <p className="text-sm text-slate-500 mt-1">
          Cerrar sesión y volver al inicio del sitio.
        </p>
      </button>
    </div>
  )
}
