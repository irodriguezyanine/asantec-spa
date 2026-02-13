"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { CotizacionCliente } from "@/types/cotizacion"
import type { Empresa, Contacto } from "@/types/cliente"

interface ClienteAutocompleteProps {
  value: CotizacionCliente
  onChange: (cliente: CotizacionCliente) => void
  disabled?: boolean
}

export function ClienteAutocomplete({
  value,
  onChange,
  disabled,
}: ClienteAutocompleteProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [showEmpresaDropdown, setShowEmpresaDropdown] = useState(false)
  const [showRutDropdown, setShowRutDropdown] = useState(false)
  const [showContactoDropdown, setShowContactoDropdown] = useState(false)
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(null)
  const [loadingEmpresas, setLoadingEmpresas] = useState(false)
  const [loadingContactos, setLoadingContactos] = useState(false)
  const empresaRef = useRef<HTMLDivElement>(null)
  const rutRef = useRef<HTMLDivElement>(null)
  const contactoRef = useRef<HTMLDivElement>(null)

  const fetchEmpresas = useCallback(async (q: string) => {
    if (q.length < 2) {
      setEmpresas([])
      return
    }
    setLoadingEmpresas(true)
    try {
      const res = await fetch(`/api/clientes/empresas?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data = await res.json()
        setEmpresas(data)
      } else {
        setEmpresas([])
      }
    } catch {
      setEmpresas([])
    } finally {
      setLoadingEmpresas(false)
    }
  }, [])

  const fetchContactos = useCallback(async (empresaId: string) => {
    setLoadingContactos(true)
    try {
      const res = await fetch(`/api/clientes/contactos?empresaId=${encodeURIComponent(empresaId)}`)
      if (res.ok) {
        const data = await res.json()
        setContactos(data)
      } else {
        setContactos([])
      }
    } catch {
      setContactos([])
    } finally {
      setLoadingContactos(false)
    }
  }, [])

  useEffect(() => {
    if (value.empresa && value.empresa.length >= 2) {
      fetchEmpresas(value.empresa)
    } else {
      setEmpresas([])
    }
  }, [value.empresa, fetchEmpresas])

  useEffect(() => {
    if (value.rut && value.rut.length >= 2) {
      fetchEmpresas(value.rut)
    }
  }, [value.rut, fetchEmpresas])

  useEffect(() => {
    if (selectedEmpresaId) {
      fetchContactos(selectedEmpresaId)
    } else {
      setContactos([])
    }
  }, [selectedEmpresaId, fetchContactos])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const outsideEmpresa = empresaRef.current && !empresaRef.current.contains(target)
      const outsideRut = rutRef.current && !rutRef.current.contains(target)
      const outsideContacto = contactoRef.current && !contactoRef.current.contains(target)
      if (outsideEmpresa && outsideRut && outsideContacto) {
        setShowEmpresaDropdown(false)
        setShowRutDropdown(false)
        setShowContactoDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function selectEmpresa(e: Empresa) {
    onChange({
      ...value,
      empresa: e.nombre,
      rut: e.rut,
    })
    setSelectedEmpresaId(e.id)
    setShowEmpresaDropdown(false)
    setShowRutDropdown(false)
  }

  function selectContacto(c: Contacto) {
    onChange({
      ...value,
      contacto: c.nombre,
      mail: c.email,
      fono: c.telefono,
    })
    setShowContactoDropdown(false)
  }

  function handleEmpresaChange(v: string) {
    onChange({ ...value, empresa: v })
    setSelectedEmpresaId(null)
    if (v.length >= 2) {
      fetchEmpresas(v)
      setShowEmpresaDropdown(true)
      setShowRutDropdown(false)
    } else {
      setShowEmpresaDropdown(false)
    }
  }

  function handleRutChange(v: string) {
    onChange({ ...value, rut: v })
    setSelectedEmpresaId(null)
    if (v.length >= 2) {
      fetchEmpresas(v)
      setShowRutDropdown(true)
      setShowEmpresaDropdown(false)
    } else {
      setShowRutDropdown(false)
    }
  }

  function handleContactoFocus() {
    if (selectedEmpresaId && contactos.length > 0) {
      setShowContactoDropdown(true)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div ref={empresaRef} className="relative">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Empresa *
        </label>
        <input
          type="text"
          value={value.empresa}
          onChange={(e) => handleEmpresaChange(e.target.value)}
          onFocus={() => value.empresa.length >= 2 && setShowEmpresaDropdown(true)}
          required
          disabled={disabled}
          placeholder="Nombre de la empresa"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
        />
        {showEmpresaDropdown && empresas.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg py-1">
            {loadingEmpresas ? (
              <li className="px-4 py-2 text-sm text-slate-500">Buscando...</li>
            ) : (
              empresas.map((e) => (
                <li
                  key={e.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectEmpresa(e)}
                  onKeyDown={(ev) => ev.key === "Enter" && selectEmpresa(e)}
                  className="px-4 py-2 hover:bg-sky-50 cursor-pointer text-sm"
                >
                  <span className="font-medium text-slate-800">{e.nombre}</span>
                  {e.rut && (
                    <span className="ml-2 text-slate-500 text-xs">RUT: {e.rut}</span>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div ref={rutRef} className="relative">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          RUT
        </label>
        <input
          type="text"
          value={value.rut}
          onChange={(e) => handleRutChange(e.target.value)}
          onFocus={() => value.rut.length >= 2 && setShowRutDropdown(true)}
          disabled={disabled}
          placeholder="12.345.678-9"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
        />
        {showRutDropdown && empresas.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg py-1">
            {loadingEmpresas ? (
              <li className="px-4 py-2 text-sm text-slate-500">Buscando...</li>
            ) : (
              empresas.map((e) => (
                <li
                  key={e.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectEmpresa(e)}
                  onKeyDown={(ev) => ev.key === "Enter" && selectEmpresa(e)}
                  className="px-4 py-2 hover:bg-sky-50 cursor-pointer text-sm"
                >
                  <span className="font-medium text-slate-800">{e.nombre}</span>
                  <span className="ml-2 text-slate-500 text-xs">RUT: {e.rut}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div ref={contactoRef} className="relative sm:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Contacto
        </label>
        <input
          type="text"
          value={value.contacto}
          onChange={(e) => onChange({ ...value, contacto: e.target.value })}
          onFocus={handleContactoFocus}
          disabled={disabled}
          placeholder="Nombre del contacto"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
        />
        {showContactoDropdown && contactos.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg py-1">
            {loadingContactos ? (
              <li className="px-4 py-2 text-sm text-slate-500">Cargando...</li>
            ) : (
              contactos.map((c) => (
                <li
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectContacto(c)}
                  onKeyDown={(ev) => ev.key === "Enter" && selectContacto(c)}
                  className="px-4 py-2 hover:bg-sky-50 cursor-pointer text-sm"
                >
                  <span className="font-medium text-slate-800">{c.nombre}</span>
                  {(c.email || c.telefono) && (
                    <span className="block text-xs text-slate-500 mt-0.5">
                      {c.email} {c.telefono && `• ${c.telefono}`}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={value.mail}
          onChange={(e) => onChange({ ...value, mail: e.target.value })}
          disabled={disabled}
          placeholder="email@empresa.cl"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Teléfono
        </label>
        <input
          type="text"
          value={value.fono}
          onChange={(e) => onChange({ ...value, fono: e.target.value })}
          disabled={disabled}
          placeholder="+569 1234 5678"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </div>
  )
}
