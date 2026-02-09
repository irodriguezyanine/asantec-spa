import Link from "next/link"

export function Hero() {
  return (
    <section className="relative text-white overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Fondo.png')" }}
      />
      {/* Overlay azul semitransparente - permite ver la imagen desvanecida detrás */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-600/85 via-sky-700/88 to-slate-800/92" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-sky-200 font-medium uppercase tracking-wider text-sm mb-2">Más de 10 años en Chile</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Tu socio tecnológico
          </h1>
          <p className="mt-4 text-lg text-sky-100">
            Soluciones informáticas y tecnológicas para empresas, colegios, universidades y particulares. 
            Hardware, periféricos y soluciones a medida con entrega en todo Chile.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition shadow-lg"
            >
              Ver catálogo
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition border border-white/30"
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
