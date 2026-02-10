import { ProductCard } from "@/components/ProductCard"
import { getProducts } from "@/lib/products"

export const metadata = {
  title: "Catálogo | ASANTEC SPA",
  description: "Catálogo de productos tecnológicos: computadores, monitores, periféricos, impresoras y más.",
}

export default async function CatalogoPage() {
  const products = await getProducts()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Catálogo de productos</h1>
      <p className="text-slate-600 mb-8">
        Explora nuestra oferta de hardware y soluciones tecnológicas.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} hidePrice={product.showPublicPrice === false} />
        ))}
      </div>
    </div>
  )
}
