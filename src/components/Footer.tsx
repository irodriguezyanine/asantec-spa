import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-3">ASANTEC SPA</h3>
            <p className="text-sky-400 font-medium">Tu socio tecnológico!</p>
            <p className="mt-2 text-sm">
              Más de 10 años ofreciendo soluciones informáticas y tecnológicas en todo Chile.
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
              <li><Link href="/catalogo/computadores" className="hover:text-sky-400 transition">Computadores</Link></li>
              <li><Link href="/catalogo/monitores" className="hover:text-sky-400 transition">Monitores</Link></li>
              <li><Link href="/catalogo/perifericos" className="hover:text-sky-400 transition">Periféricos</Link></li>
              <li><Link href="/catalogo/impresoras" className="hover:text-sky-400 transition">Impresoras</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:ventas@asantec.cl" className="hover:text-sky-400 transition">ventas@asantec.cl</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:+56912345678" className="hover:text-sky-400 transition">+56 9 1234 5678</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Todo Chile</span>
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
