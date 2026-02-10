import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/types/product"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  className?: string
  hidePrice?: boolean
}

export function ProductCard({ product, className, hidePrice }: ProductCardProps) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className={cn(
        "group block bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-sky-200 transition-all duration-200",
        className
      )}
    >
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-4xl font-light">
          {product.categorySlug === "computadores" && "💻"}
          {product.categorySlug === "monitores" && "🖥️"}
          {product.categorySlug === "perifericos" && "⌨️"}
          {product.categorySlug === "impresoras" && "🖨️"}
          {product.categorySlug === "almacenamiento" && "💾"}
          {product.categorySlug === "red-y-conectividad" && "🔌"}
          {!["computadores", "monitores", "perifericos", "impresoras", "almacenamiento", "red-y-conectividad"].includes(product.categorySlug) && "📦"}
        </div>
        {product.image && (product.image.startsWith("http") || product.image.startsWith("/")) ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized={product.image.startsWith("http")}
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : null}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-sky-600 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold text-slate-800 mt-1 line-clamp-2 group-hover:text-sky-600 transition">
          {product.name}
        </h3>
        {hidePrice ? (
          <a
            href={`https://wa.me/56998661395?text=${encodeURIComponent(`Hola! Vengo de asantec.cl y me interesa cotizar: "${product.name}"`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
          >
            Cotizar
          </a>
        ) : (
          <p className="mt-2 text-lg font-bold text-sky-600">{product.priceFormatted}</p>
        )}
        {product.inStock === false && (
          <p className="text-sm text-amber-600 mt-1">Sin stock</p>
        )}
      </div>
    </Link>
  )
}
