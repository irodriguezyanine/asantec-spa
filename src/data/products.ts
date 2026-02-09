import type { Product, Category } from "@/types/product"

/**
 * Catálogo de productos ASANTEC SPA
 * Edita este archivo (o reemplázalo por una carga desde JSON/API) para actualizar el catálogo.
 */
export const categories: Category[] = [
  { id: "computadores", name: "Computadores", slug: "computadores", description: "Notebooks, PCs de escritorio y todo en uno" },
  { id: "monitores", name: "Monitores", slug: "monitores", description: "Pantallas y monitores para oficina y gaming" },
  { id: "perifericos", name: "Periféricos", slug: "perifericos", description: "Teclados, mouse, webcams y más" },
  { id: "impresoras", name: "Impresoras", slug: "impresoras", description: "Impresoras y multifuncionales" },
  { id: "almacenamiento", name: "Almacenamiento", slug: "almacenamiento", description: "Discos duros, SSD, memorias" },
  { id: "red-y-conectividad", name: "Red y conectividad", slug: "red-y-conectividad", description: "Cables, conectores, redes" },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Notebook HP 15-fc0010la 15.6\" AMD Ryzen 5 16GB 512GB SSD",
    slug: "notebook-hp-15-fc0010la",
    brand: "HP",
    category: "Computadores",
    categorySlug: "computadores",
    description: "Notebook ideal para trabajo y estudio. Pantalla 15.6\" FHD, procesador AMD Ryzen 5, 16GB RAM, 512GB SSD. Incluye Windows 11.",
    price: 449990,
    priceFormatted: "$449.990",
    image: "",
    featured: true,
    inStock: true,
  },
  {
    id: "2",
    name: "Notebook Lenovo IdeaPad 3 15.6\" Intel Core i5 8GB 256GB",
    slug: "notebook-lenovo-ideapad-3",
    brand: "Lenovo",
    category: "Computadores",
    categorySlug: "computadores",
    description: "Rendimiento equilibrado para el día a día. Pantalla 15.6\" HD, Intel Core i5, 8GB RAM, 256GB SSD.",
    price: 329990,
    priceFormatted: "$329.990",
    image: "",
    featured: true,
    inStock: true,
  },
  {
    id: "3",
    name: "Monitor LG 24\" 24MP400-B Full HD IPS",
    slug: "monitor-lg-24mp400",
    brand: "LG",
    category: "Monitores",
    categorySlug: "monitores",
    description: "Monitor 24\" Full HD IPS, ideal para oficina y uso general. Bordes ultrafinos.",
    price: 129990,
    priceFormatted: "$129.990",
    image: "",
    featured: true,
    inStock: true,
  },
  {
    id: "4",
    name: "Monitor Samsung 27\" Curvo 75Hz C27R500",
    slug: "monitor-samsung-27-curvo",
    brand: "Samsung",
    category: "Monitores",
    categorySlug: "monitores",
    description: "Monitor curvo 27\" Full HD, 75Hz. Diseño elegante para trabajo y entretenimiento.",
    price: 179990,
    priceFormatted: "$179.990",
    image: "",
    featured: false,
    inStock: true,
  },
  {
    id: "5",
    name: "Teclado y Mouse inalámbricos HP K2500",
    slug: "teclado-mouse-hp-k2500",
    brand: "HP",
    category: "Periféricos",
    categorySlug: "perifericos",
    description: "Combo teclado y mouse inalámbrico, diseño compacto. Incluye receptor USB.",
    price: 29990,
    priceFormatted: "$29.990",
    image: "",
    featured: true,
    inStock: true,
  },
  {
    id: "6",
    name: "Impresora HP DeskJet 2332 Multifuncional",
    slug: "impresora-hp-deskjet-2332",
    brand: "HP",
    category: "Impresoras",
    categorySlug: "impresoras",
    description: "Impresión, copia y escaneo. Ideal para hogar y oficina pequeña.",
    price: 49990,
    priceFormatted: "$49.990",
    image: "",
    featured: false,
    inStock: true,
  },
  {
    id: "7",
    name: "SSD Kingston A400 480GB SATA",
    slug: "ssd-kingston-a400-480gb",
    brand: "Kingston",
    category: "Almacenamiento",
    categorySlug: "almacenamiento",
    description: "Disco sólido 480GB SATA. Acelera tu PC o notebook de forma económica.",
    price: 42990,
    priceFormatted: "$42.990",
    image: "",
    featured: false,
    inStock: true,
  },
  {
    id: "8",
    name: "Cable HDMI 2.0 2 metros",
    slug: "cable-hdmi-2-metros",
    brand: "Genérico",
    category: "Red y conectividad",
    categorySlug: "red-y-conectividad",
    description: "Cable HDMI de alta velocidad, soporte 4K. Conecta PC, consolas y televisores.",
    price: 7990,
    priceFormatted: "$7.990",
    image: "",
    featured: false,
    inStock: true,
  },
]

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getAllCategories(): Category[] {
  return categories
}
