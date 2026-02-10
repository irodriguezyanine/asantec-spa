import Link from "next/link"

export const metadata = {
  title: "Nosotros | ASANTEC SPA",
  description: "Asantec Spa: Empresa de comercialización y distribución de productos tecnológicos e informáticos desde 2016.",
}

export default function NosotrosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Nosotros</h1>

      <p className="text-slate-600 mb-6">
        <strong>Asantec Spa</strong> es una Empresa de Comercialización y Distribución de productos Tecnológicos e Informáticos de todo Tipo (Software, Hardware, Servidores, Estaciones de Trabajo, Piezas, Partes, Suministros, Impresoras, etc.)
      </p>

      <p className="text-slate-600 mb-6">
        Creada en el año 2016, Partner de las principales Marcas y Distribuidores Mayoristas de Computación y Tecnología del país, lo que nos permite tener los mejores precios competitivos del mercado, un rápido servicio de entrega con reales garantías sobre los productos y servicios entregados.
      </p>

      <p className="text-slate-600 mb-6">
        Desde nuestros inicios hemos atendido a todo tipo de Instituciones Públicas o Privadas, Universidades, Colegios, Corporaciones Educacionales, etc., buscando y entregando las mejores soluciones tecnológicas solicitadas, siempre con las mejores condiciones de precio y entrega personalizada.
      </p>

      <p className="text-slate-600 mb-6">
        Entendemos que normalmente necesitan actualizar o renovar sus equipos y junto a ello requiera de suministros o insumos tecnológicos, sobre todo en estos momentos donde deba planificar sus necesidades para el año 2026.
      </p>

      <p className="text-slate-600 mb-6">
        Es por ello que lo invitamos a contactarnos directamente a nuestros teléfonos{" "}
        <a href="tel:+56961901453" className="text-sky-600 hover:underline font-medium">+56 9 6190 1453</a> o{" "}
        <a href="tel:+56998661395" className="text-sky-600 hover:underline font-medium">+56 9 9866 1395</a> y así atenderemos su requerimiento ofreciéndole la mejor opción del mercado.
      </p>

      <p className="text-slate-600 mb-12">
        Quedando desde ya atento a su comunicación, se despide atentamente,
      </p>

      <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 mb-12">
        <p className="font-bold text-slate-800 text-lg">Asantec Spa</p>
        <p className="text-slate-600 mt-1">Av. Francisco Bilbao 3771 oficina 402, Providencia</p>
        <a href="tel:+56961901453" className="text-sky-600 hover:underline font-medium mt-1 inline-block">+56 9 6190 1453</a>
        <Link
          href="/contacto"
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
        >
          Contactar
        </Link>
      </div>

      <section className="pt-12 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Gerente General</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
            <img
              src="/GerentegeneralASANTEC.png"
              alt="Jorge Ignacio Rodríguez Bonilla - Gerente General ASANTEC"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xl font-semibold text-slate-800">Jorge Ignacio Rodríguez Bonilla</p>
            <p className="text-sky-600 font-medium">Gerente General</p>
            <p className="text-slate-600 mt-2 text-sm">
              A cargo de la dirección y estrategia de ASANTEC SPA, con foco en soluciones tecnológicas y atención al cliente.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
