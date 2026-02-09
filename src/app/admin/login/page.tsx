"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [registerMode, setRegisterMode] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (registerMode) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al registrar")
        setRegisterSuccess("Usuario creado. Ahora puedes iniciar sesión.")
        setRegisterMode(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al registrar")
      } finally {
        setLoading(false)
      }
      return
    }

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Usuario o contraseña incorrectos")
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
            {registerMode ? "Crear administrador" : "Admin ASANTEC"}
          </h1>
          <p className="text-slate-500 text-center text-sm mb-6">
            {registerMode
              ? "Registra el primer usuario (solo si aún no existe uno)"
              : "Inicia sesión para gestionar el catálogo"}
          </p>

          {registerSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm">
              {registerSuccess}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="admin"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={registerMode ? "new-password" : "current-password"}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="••••••••"
              />
              {registerMode && (
                <p className="text-xs text-slate-500 mt-1">Mínimo 6 caracteres</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-50"
            >
              {loading ? "Espera..." : registerMode ? "Crear usuario" : "Iniciar sesión"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setRegisterMode(!registerMode)
              setError("")
              setRegisterSuccess("")
            }}
            className="mt-4 w-full text-sm text-sky-600 hover:underline"
          >
            {registerMode ? "Ya tengo cuenta, ir a login" : "Crear primer administrador"}
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm mt-4">
          <Link href="/" className="text-sky-600 hover:underline">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
