import { Hero } from "@/components/Hero"
import { CategoryCard } from "@/components/CategoryCard"
import { ProductCard } from "@/components/ProductCard"
import { categories } from "@/data/products"
import { getFeaturedProductsSafe } from "@/lib/products"
import Link from "next/link"

export default async function HomePage() {
  const featured = await getFeaturedProductsSafe()

  return (
    <>
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-white border-y border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Productos destacados</h2>
          <Link href="/catalogo" className="text-sky-600 font-semibold hover:underline">
            Ver todo el catálogo →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} hidePrice={product.showPublicPrice === false} />
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">¿Por qué ASANTEC?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-3xl">✓</span>
            <h3 className="font-semibold text-slate-800 mt-2">Calidad garantizada</h3>
            <p className="text-slate-600 text-sm mt-1">Productos de marcas líderes: HP, Lenovo, Asus, Samsung, LG.</p>
          </div>
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-3xl">🚚</span>
            <h3 className="font-semibold text-slate-800 mt-2">Entrega en todo Chile</h3>
            <p className="text-slate-600 text-sm mt-1">Despacho rápido y eficiente a empresas y particulares.</p>
          </div>
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-3xl">🛠️</span>
            <h3 className="font-semibold text-slate-800 mt-2">Soporte especializado</h3>
            <p className="text-slate-600 text-sm mt-1">Asesoría técnica y soluciones a medida.</p>
          </div>
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-3xl">💰</span>
            <h3 className="font-semibold text-slate-800 mt-2">Precios competitivos</h3>
            <p className="text-slate-600 text-sm mt-1">Ofertas para empresas, educación y estado.</p>
          </div>
        </div>
      </section>
    </>
  )
}
