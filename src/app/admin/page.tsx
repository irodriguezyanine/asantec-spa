import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Bienvenido, {session.user?.name}
      </h1>
      <p className="text-slate-600 mb-8">
        Desde aquí puedes gestionar el catálogo de productos ASANTEC.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/productos"
          className="block p-6 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition"
        >
          <span className="text-3xl">📦</span>
          <h2 className="font-semibold text-slate-800 mt-2">Productos</h2>
          <p className="text-sm text-slate-500 mt-1">
            Agregar, editar o eliminar productos del catálogo. Sube fotos y actualiza precios.
          </p>
        </Link>

        <Link
          href="/"
          className="block p-6 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition"
        >
          <span className="text-3xl">🌐</span>
          <h2 className="font-semibold text-slate-800 mt-2">Ver sitio</h2>
          <p className="text-sm text-slate-500 mt-1">
            Ir a la página principal de ASANTEC.
          </p>
        </Link>
      </div>
    </div>
  )
}
