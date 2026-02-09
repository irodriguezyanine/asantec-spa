export const metadata = {
  title: "Nosotros | ASANTEC SPA",
  description: "Conoce a ASANTEC SPA: más de 10 años como tu socio tecnológico en Chile.",
}

export default function NosotrosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Nosotros</h1>
      <p className="text-slate-600 mb-6">
        En <strong>ASANTEC SPA</strong> somos una empresa con más de <strong>10 años de experiencia</strong> en la venta de soluciones informáticas y tecnológicas para empresas, colegios, universidades, institutos, organismos del estado y particulares en todo Chile.
      </p>
      <p className="text-slate-600 mb-6">
        Nos enfocamos en ofrecer productos y servicios de alta calidad a precios competitivos, con un compromiso firme con la satisfacción del cliente.
      </p>
      <h2 className="text-xl font-bold text-slate-800 mt-8 mb-3">Nuestros productos</h2>
      <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6">
        <li>Hardware de computación: computadores, servidores, pantallas, mouse, teclados, impresoras y más</li>
        <li>Elementos complementarios: cables, conectores, tarjetas de memoria, candados de seguridad</li>
        <li>Soluciones tecnológicas personalizadas para empresas y organizaciones</li>
      </ul>
      <h2 className="text-xl font-bold text-slate-800 mt-8 mb-3">Nuestros socios</h2>
      <p className="text-slate-600 mb-6">
        Somos distribuidores autorizados de marcas como: <strong>HP, Lenovo, Asus, Samsung, LG, AOC</strong>, entre otras.
      </p>
      <h2 className="text-xl font-bold text-slate-800 mt-8 mb-3">Nuestro compromiso</h2>
      <ul className="list-disc list-inside text-slate-600 space-y-2 mb-12">
        <li>Calidad garantizada en todos nuestros productos y servicios</li>
        <li>Precios competitivos y justos</li>
        <li>Entrega rápida y eficiente en todo Chile</li>
        <li>Soporte técnico especializado y personalizado</li>
        <li>Importamos soluciones personalizadas para necesidades específicas</li>
      </ul>

      <section className="mt-16 pt-12 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Gerente General</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
            <img
              src="/gerente-general.png"
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
