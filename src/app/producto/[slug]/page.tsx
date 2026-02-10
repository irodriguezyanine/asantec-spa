import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getProductBySlugSafe } from "@/lib/products"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlugSafe(slug)
  if (!product) return { title: "Producto | ASANTEC SPA" }
  return {
    title: `${product.name} | ASANTEC SPA`,
    description: product.description,
  }
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlugSafe(slug)
  if (!product) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-sky-600">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href="/catalogo" className="hover:text-sky-600">Catálogo</Link>
        <span className="mx-2">/</span>
        <Link href={`/catalogo/${product.categorySlug}`} className="hover:text-sky-600">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800 line-clamp-1">{product.name}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center">
          {product.image && (product.image.startsWith("http") || product.image.startsWith("/")) ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized={product.image.startsWith("http")}
              className="object-contain p-4"
              sizes="(max-width: 1024px) 50vw, 40vw"
            />
          ) : (
            <span className="text-8xl">
              {product.categorySlug === "computadores" && "💻"}
              {product.categorySlug === "monitores" && "🖥️"}
              {product.categorySlug === "perifericos" && "⌨️"}
              {product.categorySlug === "impresoras" && "🖨️"}
              {product.categorySlug === "almacenamiento" && "💾"}
              {product.categorySlug === "red-y-conectividad" && "🔌"}
              {!["computadores", "monitores", "perifericos", "impresoras", "almacenamiento", "red-y-conectividad"].includes(product.categorySlug) && "📦"}
            </span>
          )}
        </div>
        <div>
          <p className="text-sky-600 font-semibold uppercase tracking-wide">{product.brand}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{product.name}</h1>
          <p className="text-3xl font-bold text-sky-600 mt-4">{product.priceFormatted}</p>
          <p className="text-slate-600 mt-4">{product.description}</p>
          {product.inStock === false && (
            <p className="text-amber-600 font-medium mt-2">Sin stock actualmente</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/56998661395?text=${encodeURIComponent(`Hola! Vengo de asantec.cl y estoy interesado en el modelo "${product.name}"`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition inline-block"
            >
              Consultar disponibilidad
            </a>
            <Link
              href="/contacto"
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition inline-block"
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
