import "next-auth"

declare module "next-auth" {
  interface User {
    id?: string
  }

  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      canManageUsers?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    name?: string
    canManageUsers?: boolean
  }
}
