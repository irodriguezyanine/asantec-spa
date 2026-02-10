import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { WhatsAppButton } from "@/components/WhatsAppButton"
import { SessionProvider } from "@/components/SessionProvider"
import { getCategoriesSafe } from "@/lib/categories"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ASANTEC SPA | Tu socio tecnológico - Soluciones informáticas en Chile",
  description:
    "Más de 10 años ofreciendo hardware, computadores, monitores, periféricos y soluciones tecnológicas para empresas, colegios, universidades y particulares. Entrega en todo Chile.",
  keywords: [
    "tecnología Chile",
    "computadores",
    "hardware",
    "venta empresas",
    "soluciones informáticas",
    "ASANTEC",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await getCategoriesSafe()
  const mainCategories = categories.filter((c) => !c.parentId)
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <SessionProvider>
          <Header categories={mainCategories} />
          <main className="flex-1">{children}</main>
          <Footer categories={mainCategories} />
          <WhatsAppButton />
        </SessionProvider>
      </body>
    </html>
  )
}
