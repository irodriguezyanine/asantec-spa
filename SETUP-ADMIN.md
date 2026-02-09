# Configuración del panel de administración ASANTEC

## 1. Instalar dependencias

```bash
npm install
```

## 2. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@ASANTEC.xxxxx.mongodb.net/asantec?retryWrites=true&w=majority
NEXTAUTH_SECRET=genera-una-clave-secreta-aleatoria
NEXTAUTH_URL=http://localhost:3000
```

- **MONGODB_URI**: Copia la URI desde MongoDB Atlas (Connect → Drivers)
- **NEXTAUTH_SECRET**: Genera una con `openssl rand -base64 32` o cualquier string aleatorio largo

## 3. Inicializar la base de datos

1. Crea la base de datos y colecciones en MongoDB Atlas (Data Explorer → Create Database).
2. Ejecuta el seed para migrar productos y categorías existentes:
   - Abre en el navegador: `http://localhost:3000/api/seed`
   - O ejecuta: `curl http://localhost:3000/api/seed` (con el servidor corriendo)

## 4. Crear el primer administrador

1. Ve a `http://localhost:3000/admin/login`
2. Haz clic en "Crear primer administrador"
3. Ingresa usuario y contraseña (mínimo 6 caracteres)
4. Haz clic en "Crear usuario"
5. Luego inicia sesión con esas credenciales

## 5. Usar el panel admin

- **URL**: `http://localhost:3000/admin`
- **Productos**: Agregar, editar, eliminar productos y subir fotos
- El enlace "Admin" aparece en el header cuando inicias sesión
