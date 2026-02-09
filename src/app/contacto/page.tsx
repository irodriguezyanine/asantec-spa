export const metadata = {
  title: "Contacto | ASANTEC SPA",
  description: "Contacta a ASANTEC SPA para cotizaciones y soluciones tecnológicas.",
}

export default function ContactoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Contacto</h1>
      <p className="text-slate-600 mb-8">
        ¿Necesitas una cotización o asesoría? Escríbenos o llámanos. Estamos para ayudarte.
      </p>
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <h3 className="font-semibold text-slate-800">Email</h3>
          <a href="mailto:ventas@asantec.cl" className="text-sky-600 hover:underline">ventas@asantec.cl</a>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <h3 className="font-semibold text-slate-800">Teléfono</h3>
          <a href="tel:+56912345678" className="text-sky-600 hover:underline">+56 9 1234 5678</a>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <h3 className="font-semibold text-slate-800">Alcance</h3>
          <p className="text-slate-600">Atendemos en todo Chile. Empresas, colegios, universidades, organismos del estado y particulares.</p>
        </div>
      </div>
    </div>
  )
}
