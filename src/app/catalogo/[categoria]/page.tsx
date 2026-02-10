import { notFound } from "next/navigation"
import Link from "next/link"
import { ProductCard } from "@/components/ProductCard"
import { categories } from "@/data/products"
import { getProductsByCategorySafe } from "@/lib/products"
import { getHidePrices } from "@/lib/settings"

interface PageProps {
  params: Promise<{ categoria: string }>
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ categoria: cat.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { categoria } = await params
  const cat = categories.find((c) => c.slug === categoria)
  if (!cat) return { title: "Categoría | ASANTEC SPA" }
  return {
    title: `${cat.name} | ASANTEC SPA`,
    description: cat.description ?? `Productos de ${cat.name}.`,
  }
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria } = await params
  const cat = categories.find((c) => c.slug === categoria)
  if (!cat) notFound()

  const [items, hidePrices] = await Promise.all([getProductsByCategorySafe(categoria), getHidePrices()])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/" className="hover:text-sky-600">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href="/catalogo" className="hover:text-sky-600">Catálogo</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{cat.name}</span>
      </nav>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">{cat.name}</h1>
      {cat.description && (
        <p className="text-slate-600 mb-8">{cat.description}</p>
      )}
      {items.length === 0 ? (
        <p className="text-slate-500">No hay productos en esta categoría por el momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} hidePrice={hidePrices || product.showPublicPrice === false} />
          ))}
        </div>
      )}
    </div>
  )
}
