import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { WhatsAppButton } from "@/components/WhatsAppButton"
import { SessionProvider } from "@/components/SessionProvider"
import { AnalyticsTracker } from "@/components/AnalyticsTracker"
import { getCategoriesSafe } from "@/lib/categories"
import { getSeoConfig } from "@/lib/seo"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoConfig()
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
    },
  }
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
          <AnalyticsTracker />
          <Header categories={mainCategories} />
          <main className="flex-1">{children}</main>
          <Footer categories={mainCategories} />
          <WhatsAppButton />
        </SessionProvider>
      </body>
    </html>
  )
}
