# Portafolio — Resumen del proyecto ASANTEC SPA

Texto listo para copiar y pegar en tu página de Portafolio.

---

## Proyecto: ASANTEC SPA

### Descripción general
Sitio web corporativo y catálogo de productos tecnológicos para una empresa chilena de comercialización y distribución de soluciones informáticas.

### Detalle del proyecto
Plataforma web para **ASANTEC SPA**, empresa con sede en Providencia que desde 2016 atiende a instituciones públicas y privadas, universidades, colegios y empresas en todo Chile. El sitio presenta un catálogo dinámico de productos tecnológicos (computadores, monitores, periféricos, impresoras, almacenamiento, etc.) con categorías jerárquicas, productos destacados y precios configurables (incluyendo opción de ocultar precios al público para cotización). Incluye secciones institucionales (Nosotros, Contacto), información del gerente general y datos de contacto. Un panel de administración permite a los responsables gestionar productos, categorías e inventario, subir imágenes, importar datos desde Excel/CSV y controlar visibilidad y precios en pesos chilenos.

### Características destacadas
- **Catálogo dinámico**: productos y categorías desde base de datos, con soporte para categorías principales y subcategorías.
- **Panel de administración**: área restringida con autenticación para gestionar productos (CRUD), categorías, visibilidad y precios públicos.
- **Inventario avanzado**: vista por categorías con totales en pesos chilenos, importación masiva desde Excel/CSV y plantilla descargable.
- **Gestión de imágenes**: subida de fotos de productos mediante Cloudinary.
- **Sitio institucional**: páginas Nosotros (historia, instituciones que atienden, gerente general) y Contacto (email, teléfonos, dirección, alcance nacional).
- **Experiencia de usuario**: diseño responsive, productos destacados en inicio, enlace a WhatsApp y opción de mostrar u ocultar precios según configuración del producto.

### Cómo está hecha
- **Frontend**: Next.js 14 (App Router), React, TypeScript y Tailwind CSS. Interfaz adaptable para móvil y escritorio.
- **Backend**: API con Route Handlers de Next.js para productos, categorías, autenticación, subida de archivos e importación.
- **Base de datos**: MongoDB (MongoDB Atlas) para productos, categorías y configuración.
- **Autenticación**: NextAuth.js con credenciales para el panel de administración.
- **Almacenamiento**: Cloudinary para imágenes de productos.
- **Otros**: importación desde Excel/CSV (xlsx), seed para datos iniciales y despliegue compatible con Vercel.

### Palabras clave / Tags
Catálogo, Tecnología, Chile, Corporativo, Next.js, MongoDB, Admin, Excel, Cloudinary.

---

## Versión corta (para cards o listados)

**ASANTEC SPA** — Sitio corporativo y catálogo de productos tecnológicos para una empresa chilena. Next.js 14, MongoDB, panel de administración con importación Excel y subida de imágenes (Cloudinary). Incluye Nosotros, Contacto e inventario por categorías con totales en CLP.

Tags: Catálogo, Tecnología, Chile, Corporativo, Next.js, MongoDB, Admin.
