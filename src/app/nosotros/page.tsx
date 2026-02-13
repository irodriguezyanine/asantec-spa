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
import { getNosotrosContent } from "@/lib/nosotros"

export const metadata = {
  title: "Nosotros | ASANTEC SPA",
  description:
    "Asantec Spa: Empresa de comercialización y distribución de productos tecnológicos e informáticos desde 2016.",
}

export default async function NosotrosPage() {
  const c = await getNosotrosContent()

  const tel1Href = "tel:+" + c.telefono1.replace(/\D/g, "")
  const tel2Href = "tel:+" + c.telefono2.replace(/\D/g, "")
  const cierreTelHref = "tel:+" + c.cierreTelefono.replace(/\D/g, "")

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero section */}
      <header className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 mb-6">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">{c.heroTitle}</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">{c.heroSubtitle}</p>
      </header>

      {/* Quiénes somos */}
      <section className="mb-16">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{c.asantecTitle}</h2>
            <p className="text-slate-600 leading-relaxed mb-4">{c.asantecP1}</p>
            <p className="text-slate-600 leading-relaxed">{c.asantecP2}</p>
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
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{c.institucionesTitle}</h2>
            <p className="text-slate-600 leading-relaxed mb-4">{c.institucionesP}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {c.institucionesTags.map((item) => (
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

      {/* Planificación */}
      <section className="mb-16">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{c.planifiqueTitle}</h2>
            <p className="text-slate-600 leading-relaxed">{c.planifiqueP1}</p>
            <p className="text-slate-600 leading-relaxed mt-4">{c.planifiqueP2}</p>
          </div>
        </div>
      </section>

      {/* Contacto destacado */}
      <section className="mb-16">
        <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-700 p-8 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">{c.contactoTitle}</h2>
              <p className="text-sky-100 mb-6 max-w-xl">{c.contactoP}</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={tel1Href}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition"
                >
                  <Phone className="w-5 h-5" />
                  {c.telefono1}
                </a>
                <a
                  href={tel2Href}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition"
                >
                  <Phone className="w-5 h-5" />
                  {c.telefono2}
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
          <p className="text-slate-600 italic mb-6">{c.cierreTexto}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xl font-bold text-slate-800">{c.cierreEmpresa}</p>
              <div className="mt-3 space-y-2 text-slate-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                  {c.cierreDireccion}
                </p>
                <a
                  href={cierreTelHref}
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
                >
                  <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                  {c.cierreTelefono}
                </a>
                <a
                  href={`mailto:${c.cierreEmail}`}
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
                >
                  <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                  {c.cierreEmail}
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
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{c.gerenteTitle}</h2>
        <div className="flex flex-col sm:flex-row items-center gap-8 rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="relative w-48 h-48 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-4 ring-sky-50">
            <img
              src={c.gerenteImagen}
              alt={`${c.gerenteNombre} - ${c.gerenteCargo} ASANTEC`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xl font-bold text-slate-800">{c.gerenteNombre}</p>
            <p className="text-sky-600 font-semibold mt-1">{c.gerenteCargo}</p>
            <p className="text-slate-600 mt-4 max-w-md">{c.gerenteDescripcion}</p>
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-slate-500">
              <Truck className="w-4 h-4" />
              <span className="text-sm">{c.gerenteFrase}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
