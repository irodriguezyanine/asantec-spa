import Link from "next/link"
import {
  Building2,
  Cpu,
  Truck,
  Award,
  GraduationCap,
  Briefcase,
  Phone,
  MapPin,
  Mail,
  ArrowRight,
} from "lucide-react"

export const metadata = {
  title: "Nosotros | ASANTEC SPA",
  description: "Asantec Spa: Empresa de comercialización y distribución de productos tecnológicos e informáticos desde 2016.",
}

export default function NosotrosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero section */}
      <header className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 mb-6">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">Nosotros</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Tu socio tecnológico desde 2016. Comercialización y distribución de soluciones informáticas en todo Chile.
        </p>
      </header>

      {/* Quiénes somos */}
      <section className="mb-16">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Asantec Spa</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Empresa de Comercialización y Distribución de productos Tecnológicos e Informáticos de todo tipo: Software, Hardware, Servidores, Estaciones de Trabajo, Piezas, Partes, Suministros, Impresoras y más.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Creada en el año 2016, somos Partner de las principales Marcas y Distribuidores Mayoristas de Computación y Tecnología del país, lo que nos permite ofrecer los mejores precios competitivos del mercado, un rápido servicio de entrega y garantías reales sobre los productos y servicios entregados.
            </p>
          </div>
        </div>
      </section>

      {/* A quiénes atendemos */}
      <section className="mb-16">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Instituciones que confían en nosotros</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Desde nuestros inicios hemos atendido a todo tipo de Instituciones Públicas o Privadas, Universidades, Colegios, Corporaciones Educacionales, etc., buscando y entregando las mejores soluciones tecnológicas solicitadas, siempre con las mejores condiciones de precio y entrega personalizada.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Instituciones públicas", "Universidades", "Colegios", "Corporaciones educacionales", "Empresas privadas"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium"
                >
                  <Briefcase className="w-3.5 h-3.5 text-sky-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Planificación 2026 */}
      <section className="mb-16">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Planifique sus necesidades</h2>
            <p className="text-slate-600 leading-relaxed">
              Entendemos que normalmente necesitan actualizar o renovar sus equipos y junto a ello requieren de suministros o insumos tecnológicos. Especialmente en estos momentos donde debe planificar sus necesidades para el año 2026.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Lo invitamos a contactarnos directamente y así atenderemos su requerimiento ofreciéndole la mejor opción del mercado.
            </p>
          </div>
        </div>
      </section>

      {/* Contacto destacado */}
      <section className="mb-16">
        <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-700 p-8 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">¿Necesita cotización o asesoría?</h2>
              <p className="text-sky-100 mb-6 max-w-xl">
                Contáctenos directamente por teléfono y atenderemos su requerimiento ofreciéndole la mejor opción del mercado.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+56961901453"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition"
                >
                  <Phone className="w-5 h-5" />
                  +56 9 6190 1453
                </a>
                <a
                  href="tel:+56998661395"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition"
                >
                  <Phone className="w-5 h-5" />
                  +56 9 9866 1395
                </a>
              </div>
            </div>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-sky-600 font-semibold hover:bg-sky-50 transition shrink-0"
            >
              Ir a Contacto
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tarjeta de cierre */}
      <section className="mb-16">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm">
          <p className="text-slate-600 italic mb-6">
            Quedando desde ya atento a su comunicación, se despide atentamente,
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xl font-bold text-slate-800">Asantec Spa</p>
              <div className="mt-3 space-y-2 text-slate-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                  Av. Francisco Bilbao 3771 oficina 402, Providencia
                </p>
                <a href="tel:+56961901453" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium">
                  <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                  +56 9 6190 1453
                </a>
                <a href="mailto:jorge.rodriguez@asantec.cl" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium">
                  <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                  jorge.rodriguez@asantec.cl
                </a>
              </div>
            </div>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>

      {/* Gerente General */}
      <section className="pt-12 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Gerente General</h2>
        <div className="flex flex-col sm:flex-row items-center gap-8 rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="relative w-48 h-48 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-4 ring-sky-50">
            <img
              src="/GerentegeneralASANTEC.png"
              alt="Jorge Ignacio Rodríguez Bonilla - Gerente General ASANTEC"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xl font-bold text-slate-800">Jorge Ignacio Rodríguez Bonilla</p>
            <p className="text-sky-600 font-semibold mt-1">Gerente General</p>
            <p className="text-slate-600 mt-4 max-w-md">
              A cargo de la dirección y estrategia de ASANTEC SPA, con foco en soluciones tecnológicas y atención al cliente.
            </p>
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-slate-500">
              <Truck className="w-4 h-4" />
              <span className="text-sm">Entrega en todo Chile</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
