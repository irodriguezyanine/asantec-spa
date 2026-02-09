# ASANTEC SPA — Tu socio tecnológico

Sitio web de catálogo para **ASANTEC SPA**, empresa de venta de soluciones informáticas y tecnológicas en Chile.

- **Tecnologías:** Next.js 14, TypeScript, Tailwind CSS
- **Despliegue:** compatible con Vercel y GitHub

## Cómo ejecutar en local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Modo desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000).

3. Build de producción:
   ```bash
   npm run build
   npm start
   ```

## Catálogo de productos (dinámico)

El catálogo se gestiona en **`src/data/products.ts`**:

- **`categories`**: array de categorías (id, name, slug, description).
- **`products`**: array de productos con: id, name, slug, brand, category, categorySlug, description, price, priceFormatted, image, featured, inStock.

Para añadir o editar productos, modifica ese archivo. Opcionalmente puedes:

- Cargar datos desde un JSON (por ejemplo `import products from './products.json'`).
- Conectar más adelante con un CMS o API y reemplazar las importaciones en las páginas.

Las imágenes de productos pueden colocarse en `public/products/` y referenciarse como `/products/nombre-imagen.jpg` en cada producto.

## Conectar con GitHub

1. Crea un repositorio nuevo en [GitHub](https://github.com/new) (por ejemplo `asantec-spa`).

2. En la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ASANTEC SPA"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/asantec-spa.git
   git push -u origin main
   ```

## Desplegar en Vercel

1. Entra en [vercel.com](https://vercel.com) e inicia sesión (con GitHub si quieres).

2. **Import Project** → elige el repositorio de GitHub `asantec-spa`.

3. Vercel detectará Next.js. Deja las opciones por defecto y haz **Deploy**.

4. Tras el despliegue tendrás una URL tipo `asantec-spa.vercel.app`. Puedes configurar un dominio propio en **Project → Settings → Domains**.

Cada `git push` a `main` generará un nuevo despliegue automático.

## Estructura del proyecto

```
asantec-spa/
├── src/
│   ├── app/              # Rutas (App Router)
│   │   ├── page.tsx      # Inicio
│   │   ├── catalogo/     # Catálogo y categorías
│   │   ├── producto/     # Detalle de producto
│   │   ├── nosotros/
│   │   └── contacto/
│   ├── components/       # Header, Footer, ProductCard, etc.
│   ├── data/             # products.ts (catálogo)
│   ├── lib/              # utils
│   └── types/            # Tipos TypeScript
├── public/               # Imágenes estáticas (p. ej. public/products/)
├── package.json
└── README.md
```

## Licencia

Proyecto privado — ASANTEC SPA.
