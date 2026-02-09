import Link from "next/link"

export function AdminNav() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="font-bold text-slate-800">
          Panel Admin ASANTEC
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/admin" className="text-slate-600 hover:text-sky-600 text-sm">
            Inicio
          </Link>
          <Link href="/admin/productos" className="text-slate-600 hover:text-sky-600 text-sm">
            Productos
          </Link>
          <Link href="/" className="text-slate-600 hover:text-sky-600 text-sm">
            Ver sitio
          </Link>
          <a
            href="/api/auth/signout"
            className="text-slate-600 hover:text-red-600 text-sm"
          >
            Cerrar sesión
          </a>
        </nav>
      </div>
    </header>
  )
}
