/**
 * Tipos para empresas y contactos (base de clientes)
 */

export interface Empresa {
  id: string
  nombre: string
  rut: string
  createdAt?: string
  updatedAt?: string
}

export interface Contacto {
  id: string
  empresaId: string
  nombre: string
  email: string
  telefono: string
  createdAt?: string
  updatedAt?: string
}
