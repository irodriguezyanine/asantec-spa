import Link from "next/link"
import type { Category } from "@/types/product"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, string> = {
  computadores: "💻",
  monitores: "🖥️",
  perifericos: "⌨️",
  impresoras: "🖨️",
  almacenamiento: "💾",
  "red-y-conectividad": "🔌",
}

interface CategoryCardProps {
  category: Category
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const icon = categoryIcons[category.slug] ?? "📦"
  return (
    <Link
      href={`/catalogo/${category.slug}`}
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all duration-200 group",
        className
      )}
    >
      <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-semibold text-slate-800 group-hover:text-sky-600 transition">{category.name}</span>
      {category.description && (
        <span className="text-sm text-slate-500 mt-1 text-center line-clamp-2">{category.description}</span>
      )}
    </Link>
  )
}
