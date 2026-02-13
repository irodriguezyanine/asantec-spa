import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FolderTree, FileText, BarChart3, Users, LogOut } from "lucide-react"
import { authOptions } from "@/lib/auth"
import { AdminDashboardCards } from "./AdminDashboardCards"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const greetingName = session.user?.name && !String(session.user.name).includes("@")
    ? session.user.name
    : "Administrador"

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Bienvenido, {greetingName}
      </h1>
      <p className="text-slate-600 mb-8">
        Desde aquí puedes gestionar el catálogo de productos ASANTEC.
      </p>

      <AdminDashboardCards />
    </div>
  )
}
