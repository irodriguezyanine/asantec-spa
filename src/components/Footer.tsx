import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import type { Category } from "@/types/product"

export function Footer({ categories = [] }: { categories?: Category[] }) {
  const cats = categories.length > 0 ? categories : [
    { id: "computadores", name: "Computadores", slug: "computadores" },
    { id: "monitores", name: "Monitores", slug: "monitores" },
    { id: "perifericos", name: "Periféricos", slug: "perifericos" },
    { id: "impresoras", name: "Impresoras", slug: "impresoras" },
  ]
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-3">ASANTEC SPA</h3>
            <p className="text-sky-400 font-medium">Tu socio tecnológico!</p>
            <p className="mt-2 text-sm">
              Av. Francisco Bilbao 3771 oficina 402, Providencia.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-sky-400 transition">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-sky-400 transition">Catálogo</Link></li>
              <li><Link href="/nosotros" className="hover:text-sky-400 transition">Nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-sky-400 transition">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Categorías</h4>
            <ul className="space-y-2 text-sm">
              {cats.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/catalogo/${cat.slug}`} className="hover:text-sky-400 transition">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:jorge.rodriguez@asantec.cl" className="hover:text-sky-400 transition">jorge.rodriguez@asantec.cl</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:+56961901453" className="hover:text-sky-400 transition">+56 9 6190 1453</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:+56998661395" className="hover:text-sky-400 transition">+56 9 9866 1395</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Av. Francisco Bilbao 3771 oficina 402, Providencia</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ASANTEC SPA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
