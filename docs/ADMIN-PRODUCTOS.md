# Panel de administración de productos – ASANTEC SPA

Este documento describe qué hace falta para tener un **usuario administrador** que pueda subir y modificar los productos del catálogo.

---

## Situación actual

- Los productos están definidos en **código estático**: `src/data/products.ts`.
- Las categorías también están en ese archivo.
- No hay base de datos ni autenticación: cualquier cambio implica editar código y volver a desplegar.

---

## Qué necesitamos para el admin

### 1. **Dónde guardar los productos (persistencia)**

Hay que pasar de “archivo TS” a algo que el admin pueda modificar desde la web:

| Opción | Descripción | Complejidad |
|--------|-------------|-------------|
| **Base de datos** (PostgreSQL, MySQL, SQLite) | Los productos se guardan en tablas. Se usan APIs (Route Handlers en Next.js) para crear, editar y borrar. | Media |
| **Servicios tipo BaaS** (Supabase, Firebase, PocketBase) | Base de datos + auth + almacenamiento de archivos ya listos. Muy práctico para un admin. | Baja–media |
| **Headless CMS** (Strapi, Payload, Sanity) | Panel de administración ya hecho; solo se conecta la web para leer los datos. | Baja (si aceptas usar su panel) |

Recomendación para empezar: **Supabase** (gratis, tiene auth, DB y almacenamiento de imágenes).

---

### 2. **Autenticación del administrador**

Solo usuarios con rol “admin” deberían poder:

- Ver el panel de administración.
- Crear, editar y eliminar productos.
- Subir y cambiar imágenes.

Opciones habituales en Next.js:

- **NextAuth.js** + base de datos (tabla de usuarios y roles).
- **Supabase Auth** (si eliges Supabase): login/contraseña o magic link.
- **Clerk** o **Auth0**: más rápido de integrar, con plan gratuito.

Recomendación: si usas **Supabase**, usar **Supabase Auth** y una tabla `profiles` con un campo `role: 'admin' | 'user'`.

---

### 3. **Almacenamiento de imágenes de productos**

Hoy los productos tienen `image: ""`. Para que el admin “suba” fotos hace falta:

- **Subir archivos** desde el navegador (formulario con `input type="file"`).
- **Guardar** esas imágenes en:
  - **Carpeta en el servidor** (p. ej. `public/products/`) y guardar en DB la ruta, o
  - **Servicio de almacenamiento** (Supabase Storage, S3, Cloudinary) y guardar la URL en DB.

Recomendación: **Supabase Storage** (si usas Supabase) o **Cloudinary** (plan gratuito y bueno para imágenes).

---

### 4. **Panel de administración (UI)**

Un área restringida solo a admins, por ejemplo:

- **Rutas:** `/admin` (dashboard), `/admin/productos`, `/admin/productos/nuevo`, `/admin/productos/[id]/editar`.
- **Protección:** middleware o `getServerSideProps`/chequeo en layout que verifique si el usuario está logueado y es admin; si no, redirigir a login o a home.
- **Pantallas mínimas:**
  - Listado de productos (tabla o cards) con opciones “Editar” y “Eliminar”.
  - Formulario “Nuevo producto” y “Editar producto”: nombre, slug, marca, categoría, descripción, precio, imagen(s), destacado, en stock.
  - Subida de imagen (preview y guardado en Storage o en `public/`).

Se puede hacer todo en Next.js (App Router) con React y los Route Handlers como API.

---

## Resumen de pasos sugeridos

1. **Elegir persistencia:** por ejemplo Supabase (DB + Auth + Storage).
2. **Modelar datos:** tablas `products` y `categories` (o usar las que ya tengas en `products.ts` como guía).
3. **Configurar auth:** registro/login solo para el admin (o invitación por email). Campo `role = 'admin'` en el perfil.
4. **API en Next.js:** Route Handlers (o Server Actions) para:
   - Listar / crear / actualizar / borrar productos.
   - (Opcional) listar / crear / actualizar categorías.
5. **Subida de imágenes:** endpoint o Server Action que reciba el archivo, lo suba a Supabase Storage (o similar) y devuelva la URL para guardarla en el producto.
6. **Adaptar el sitio público:** que las páginas del catálogo lean de la API o de la DB en lugar de `src/data/products.ts`.
7. **Implementar el panel admin:** rutas `/admin/*`, protección por rol y formularios de productos e imágenes.

---

## Próximo paso concreto

Si quieres que te guíe con **Supabase**:

1. Crear proyecto en [supabase.com](https://supabase.com).
2. Definir tablas `categories` y `products` (y `profiles` con `role` si usas Supabase Auth).
3. Añadir en el proyecto Next.js: `@supabase/supabase-js` y variables de entorno.
4. Crear las APIs (Route Handlers) y luego el panel `/admin` con login y CRUD de productos.

Si prefieres otra opción (solo base de datos, otro CMS, etc.), se puede ajustar el plan sobre esta misma base.
