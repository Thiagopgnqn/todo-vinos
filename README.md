# 🍷 Todo Vinos — Tienda Online de Vinos

Tienda online de vinos y cava digital con catálogo interactivo, carrito de compras persistente, cálculo de precios diferenciales (lista y transferencia bancaria) y checkout directo vía WhatsApp. Cuenta con un panel de administración integral para gestionar productos, tipos de vino, pedidos y usuarios.

---

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- Base de datos **PostgreSQL** o **SQLite** (gestionada con Prisma ORM)
- Cuenta en **Cloudinary** (para subida y optimización de imágenes)

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio y verificar la rama

```bash
git clone https://github.com/Thiagopgnqn/todo-vinos.git
cd vinos

# Cambiar a la rama de diseño y desarrollo activo
git checkout diseno-nuevo
```

### 2. Configurar variables de entorno

Copiar la plantilla de entorno en el backend:

```bash
cp .env.example backend/.env
```

Editar `backend/.env` con las credenciales correspondientes:

```env
# Base de datos (PostgreSQL o SQLite)
DATABASE_URL="postgresql://usuario:password@localhost:5432/todovinos?schema=public"
# Para SQLite local: "file:./dev.db"

# JWT
JWT_ACCESS_SECRET="tu-clave-secreta-access-token"
JWT_REFRESH_SECRET="tu-clave-secreta-refresh-token"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# WhatsApp — Teléfono del negocio (código de país y área sin espacios ni '+')
WHATSAPP_PHONE="5492996284585"

# Servidor
PORT=3001
CORS_ORIGIN="http://localhost:5173"

# Admin inicial (se crea con prisma db seed)
ADMIN_EMAIL="admin@todovinos.com"
ADMIN_PASSWORD="Admin123!"

# Cloudinary (Almacenamiento de imágenes de productos)
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Meta (Píxel + API de Conversiones)
META_PIXEL_ID="tu-pixel-id"
META_ACCESS_TOKEN="token-generado-en-administrador-de-eventos"
META_API_VERSION="v23.0"
# Solo para probar en "Probar eventos". Eliminar en producción una vez validado.
META_TEST_EVENT_CODE=""
```

Variables del frontend (`frontend/.env`, ver `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:3001/api   # Opcional en dev (Vite hace proxy de /api)
VITE_META_PIXEL_ID=tu-pixel-id           # Si falta, el Píxel simplemente no se carga
```

### 3. Instalar dependencias e inicializar base de datos

```bash
# Backend
cd backend
npm install
npm run prisma:generate
npm run prisma:push        # Sincroniza el esquema con la base de datos
npm run prisma:seed        # Crea el usuario administrador y datos iniciales
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 4. Ejecutar en desarrollo

Abrir **dos terminales**:

```bash
# Terminal 1 — Backend (puerto 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (puerto 5173 con Vite)
cd frontend
npm run dev
```

Abrir la aplicación en el navegador: [http://localhost:5173](http://localhost:5173).

---

## 👤 Credenciales Iniciales

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Administrador** | `admin@todovinos.com` | `Admin123!` |

> Los clientes pueden registrarse directamente desde la plataforma o realizar compras sin necesidad de estar registrados.

---

## 📁 Estructura de Archivos del Proyecto

```text
vinos/
├── backend/                                   # Servidor Backend (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma                      # Modelos de datos (User, Product, WineType, Order, etc.)
│   │   └── seed.js                            # Seed inicial (Admin y vinos representativos)
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                         # Carga centralizada de variables de entorno
│   │   ├── controllers/                       # Controladores de peticiones HTTP
│   │   │   ├── auth.controller.js             # Registro, login, refresh tokens, perfil y logout
│   │   │   ├── order.controller.js            # Creación, consulta y actualización de pedidos
│   │   │   ├── product.controller.js          # CRUD de productos y catálogo
│   │   │   ├── user.controller.js             # Listado, edición de roles y baja de usuarios
│   │   │   └── wineType.controller.js         # Gestión de tipos/categorías de vinos
│   │   ├── middleware/                        # Middlewares de Express
│   │   │   ├── admin.js                       # Verificación de permisos de rol ADMIN
│   │   │   ├── auth.js                        # Validación y decodificación de JWT
│   │   │   ├── errorHandler.js                # Captura y formateo centralizado de errores
│   │   │   ├── rateLimiter.js                 # Limitador contra ataques de fuerza bruta
│   │   │   └── validate.js                    # Validador de schemas con Zod
│   │   ├── routes/                            # Endpoints de la API
│   │   │   ├── auth.routes.js                 # Rutas de autenticación (/api/auth)
│   │   │   ├── meta.routes.js                 # Eventos de conversión para Meta CAPI (/api/meta)
│   │   │   ├── order.routes.js                # Rutas de pedidos (/api/orders)
│   │   │   ├── product.routes.js              # Rutas de productos (/api/products)
│   │   │   ├── upload.routes.js               # Subida de imágenes a Cloudinary (/api/upload)
│   │   │   ├── user.routes.js                 # Rutas de usuarios (/api/users)
│   │   │   └── wineType.routes.js             # Rutas de tipos de vino (/api/wine-types)
│   │   ├── services/                          # Lógica de negocio e interacción con BD
│   │   │   ├── auth.service.js                # Autenticación, hashing y tokens
│   │   │   ├── meta.service.js                # Envío de eventos a la API de Conversiones de Meta
│   │   │   ├── order.service.js               # Procesamiento de órdenes y descuentos
│   │   │   ├── product.service.js             # Filtros multicriterio, paginado y ordenamiento
│   │   │   ├── user.service.js                # Operaciones sobre usuarios y permisos
│   │   │   └── wineType.service.js            # Conteo de productos asociados y categorías
│   │   ├── utils/
│   │   │   ├── cloudinary.js                  # Configuración de SDK Cloudinary
│   │   │   ├── jwt.js                         # Generación y validación de tokens JWT
│   │   │   └── whatsapp.js                    # Generación del mensaje y link de WhatsApp
│   │   ├── validators/                        # Esquemas de validación Zod
│   │   │   ├── auth.validator.js
│   │   │   ├── order.validator.js
│   │   │   ├── product.validator.js
│   │   │   └── wineType.validator.js
│   │   ├── firebase.js                        # Configuración de Firebase (opcional/complementario)
│   │   └── index.js                           # Punto de entrada y montaje de rutas de la API
│   ├── uploads/                               # Directorio para archivos temporales locales
│   ├── vercel.json                            # Configuración de despliegue en Vercel
│   └── package.json                           # Dependencias y scripts de backend
│
├── frontend/                                  # Aplicación Frontend (React 18 + Vite + TailwindCSS)
│   ├── public/                                # Recursos estáticos, manifest, favicons y SEO
│   │   ├── android-chrome-*.png               # Iconos PWA para Android
│   │   ├── apple-touch-icon.png               # Icono para dispositivos Apple
│   │   ├── favicon.ico / favicon-*.png        # Favicons multiformato
│   │   ├── logo.png / logo-transparent-*.png  # Logotipos de la marca
│   │   ├── robots.txt                         # Reglas de indexación para motores de búsqueda
│   │   ├── site.webmanifest                   # Manifiesto de aplicación web instalable
│   │   └── sitemap.xml                        # Mapa de sitio para indexación SEO
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js                      # Cliente Axios con interceptor y refresh automático
│   │   ├── components/
│   │   │   ├── admin/                         # Componentes del panel administrativo
│   │   │   │   ├── AdminSidebar.jsx           # Navegación lateral responsive para administración
│   │   │   │   ├── OrderTable.jsx             # Tabla y tarjetas de pedidos con filtros por estado
│   │   │   │   ├── ProductForm.jsx            # Formulario de producto con subida a Cloudinary
│   │   │   │   ├── ProductTable.jsx           # Gestión de catálogo con búsqueda y paginación
│   │   │   │   ├── UserForm.jsx               # Edición de usuarios y asignación de roles
│   │   │   │   └── UserTable.jsx              # Listado y control de usuarios
│   │   │   ├── auth/                          # Formularios de acceso
│   │   │   │   ├── LoginForm.jsx              # Inicio de sesión con feedback visual
│   │   │   │   └── RegisterForm.jsx           # Registro de clientes
│   │   │   ├── cart/                          # Componentes del carrito
│   │   │   │   ├── CartDrawer.jsx             # Drawer deslizable de carrito lateral
│   │   │   │   ├── CartItem.jsx               # Fila de producto con control de cantidades
│   │   │   │   └── CartSummary.jsx            # Desglose de precios (lista vs transferencia)
│   │   │   ├── catalog/                       # Componentes del catálogo
│   │   │   │   ├── FilterSidebar.jsx          # Filtros por tipo, varietal, bodega y rango de precio
│   │   │   │   ├── ProductCard.jsx            # Tarjeta de vino con badges de stock y oferta
│   │   │   │   ├── ProductGrid.jsx            # Cuadrícula responsive con estados vacíos
│   │   │   │   └── SearchBar.jsx              # Input de búsqueda interactiva
│   │   │   ├── checkout/                      # Proceso de finalización de compra
│   │   │   │   ├── AddressMap.jsx             # Mapa interactivo Leaflet para referencia de entrega
│   │   │   │   └── CheckoutForm.jsx           # Datos de entrega, método de pago y WhatsApp checkout
│   │   │   ├── layout/                        # Estructura general de interfaz
│   │   │   │   ├── Footer.jsx                 # Footer con enlaces, información fiscal y redes
│   │   │   │   ├── Header.jsx                 # Barra de navegación principal y accesos rápidos
│   │   │   │   └── Layout.jsx                 # Envoltura de páginas públicas
│   │   │   ├── ui/                            # Sistema de componentes base reutilizables
│   │   │   │   ├── Badge.jsx                  # Insignias de estado y etiquetas
│   │   │   │   ├── Button.jsx                 # Botones con variantes de estilo y estados
│   │   │   │   ├── Input.jsx                  # Campos de texto estilizados
│   │   │   │   ├── Modal.jsx                  # Diálogos modales accesibles
│   │   │   │   ├── Select.jsx                 # Selectores dropdown
│   │   │   │   ├── Skeleton.jsx               # Placeholders de carga progresiva
│   │   │   │   ├── Spinner.jsx                # Indicadores de spinner
│   │   │   │   └── Toast.jsx                  # Notificaciones emergentes
│   │   │   ├── MetaPixelTracker.jsx           # PageView de Meta en cada cambio de ruta pública
│   │   │   └── ScrollToTop.jsx                # Reset de scroll automático al cambiar de ruta
│   │   ├── config/
│   │   │   └── theme.js                       # Identidad visual, textos, logos y propuesta de valor
│   │   ├── lib/
│   │   │   └── meta.js                        # Píxel de Meta + envío espejo al backend (CAPI)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx                # Estado global de usuario, token y sesión
│   │   │   └── CartContext.jsx                # Estado del carrito con persistencia en localStorage
│   │   ├── hooks/                             # Custom React Hooks
│   │   │   ├── useAuth.js                     # Hook para consumir AuthContext
│   │   │   ├── useCart.js                     # Hook para manipular el carrito
│   │   │   ├── useProducts.js                 # Hook para listar productos y paginación
│   │   │   └── useSEO.js                      # Actualización dinámica de meta tags y OpenGraph
│   │   ├── pages/                             # Vistas de la aplicación
│   │   │   ├── admin/
│   │   │   │   ├── DashboardPage.jsx          # Métricas de ventas, stock y accesos directos
│   │   │   │   ├── OrdersPage.jsx             # Panel de gestión de pedidos
│   │   │   │   ├── ProductsPage.jsx           # Inventario, edición y alta de vinos
│   │   │   │   ├── UsersPage.jsx              # Administración de usuarios y roles
│   │   │   │   └── WineTypesPage.jsx          # Configuración dinámica de tipos de vino
│   │   │   ├── CartPage.jsx                   # Página dedicada del carrito de compras
│   │   │   ├── CatalogPage.jsx                # Catálogo completo con ordenamientos y filtros
│   │   │   ├── CheckoutPage.jsx               # Proceso de orden y confirmación
│   │   │   ├── HomePage.jsx                   # Landing editorial con destacados y beneficios
│   │   │   ├── LoginPage.jsx                  # Página de inicio de sesión
│   │   │   ├── NotFoundPage.jsx               # Página de error 404
│   │   │   ├── ProductPage.jsx                # Ficha técnica, notas de cata y maridaje
│   │   │   └── RegisterPage.jsx               # Página de registro
│   │   ├── App.jsx                            # Definición de rutas y protección de rutas admin
│   │   ├── index.css                          # Directivas Tailwind, fuentes y estilos base
│   │   └── main.jsx                           # Inicialización de React en el DOM
│   ├── index.html                             # Plantilla HTML base con meta tags SEO
│   ├── tailwind.config.js                     # Configuración de diseño, fuentes y paleta de colores
│   ├── vercel.json                            # Enrutamiento SPA para despliegue en Vercel
│   ├── vite.config.js                         # Configuración del bundler Vite
│   └── package.json                           # Dependencias y scripts de frontend
│
├── .env.example                               # Plantilla de variables de entorno
├── .gitignore                                 # Reglas de exclusión de Git
└── README.md                                  # Documentación técnica del proyecto
```

---

## 🔌 Referencia de la API

### Autenticación (`/api/auth`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/api/auth/register` | Público | Registrar un nuevo usuario cliente |
| `POST` | `/api/auth/login` | Público | Iniciar sesión (retorna access token y refresh token) |
| `POST` | `/api/auth/refresh` | Público | Renovar el access token usando refresh token |
| `POST` | `/api/auth/logout` | Autenticado | Revocar refresh token y cerrar sesión |
| `GET` | `/api/auth/me` | Autenticado | Obtener información del usuario actual |

### Productos (`/api/products`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `GET` | `/api/products` | Público | Listar productos con filtros (`type`, `varietal`, `winery`, `region`, `minPrice`, `maxPrice`, `search`, `sort`, `page`, `limit`) |
| `GET` | `/api/products/:id` | Público | Obtener detalle de una etiqueta de vino |
| `POST` | `/api/products` | Admin | Crear nueva etiqueta de vino |
| `PUT` | `/api/products/:id` | Admin | Actualizar etiqueta existente |
| `DELETE` | `/api/products/:id` | Admin | Desactivar etiqueta (borrado lógico / soft delete) |

### Tipos de Vino (`/api/wine-types`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `GET` | `/api/wine-types` | Público | Obtener tipos de vino con el conteo de etiquetas activas asociadas |
| `POST` | `/api/wine-types` | Admin | Crear un nuevo tipo de vino |
| `DELETE` | `/api/wine-types/:id` | Admin | Eliminar un tipo de vino |

### Pedidos (`/api/orders`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/api/orders` | Público / Auth | Crear un nuevo pedido (calcula stock y totales) |
| `GET` | `/api/orders` | Admin | Listar pedidos ordenados con filtros por estado |
| `GET` | `/api/orders/:id` | Admin | Consultar detalle de pedido y renglones |
| `PATCH` | `/api/orders/:id/status` | Admin | Actualizar estado (`PENDING`, `CONFIRMED`, `DELIVERED`, `CANCELLED`) |

### Subida Multimedia (`/api/upload`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/api/upload/image` | Admin | Subir imagen de vino a Cloudinary (`multipart/form-data`) |

### Meta (`/api/meta`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/api/meta/events` | Público | Recibe eventos de conversión del frontend y los reenvía a la API de Conversiones de Meta (responde `202`; `400` si el body es inválido; límite 120 req/min por IP) |

### Usuarios (`/api/users`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `GET` | `/api/users` | Admin | Listar usuarios registrados |
| `GET` | `/api/users/:id` | Admin | Consultar datos de usuario específico |
| `PUT` | `/api/users/:id` | Admin | Modificar datos y cambiar rol (`CUSTOMER` o `ADMIN`) |
| `DELETE` | `/api/users/:id` | Admin | Eliminar cuenta de usuario (protege la cuenta del superadmin) |

---

## 🗄️ Modelo de Base de Datos (Prisma)

El esquema de datos (`backend/prisma/schema.prisma`) incluye los siguientes modelos:

- **`User`**: Cuentas de clientes y administradores con autenticación por hash.
- **`Product`**: Etiquetas de vino con precio de lista, precio con descuento por transferencia (`transferPrice`), stock disponible, notas de cata, maridaje, bodega, región y contador de ventas (`soldCount`).
- **`WineType`**: Categorías dinámicas de vinos (Tinto, Blanco, Rosado, Espumante, etc.).
- **`Order`**: Pedidos registrados con método de entrega (`PICKUP` o `DELIVERY`), datos del cliente, estado y total.
- **`OrderItem`**: Detalle de productos por pedido con precio unitario y subtotal congelados al momento de compra.
- **`RefreshToken`**: Tokens de renovación con fecha de expiración y revocación para control de sesiones seguras.

---

## 💡 Características Principales

1. **Doble modalidad de precios**: Soporte para precio estándar y precio bonificado por pago con transferencia bancaria directa.
2. **Checkout estructurado por WhatsApp**: Notificación automática al dueño con el desglose exacto de productos, método de entrega y dirección.
3. **Gestión dinámica de tipos de vino**: Posibilidad de agregar o quitar tipos de vinos desde el panel de administración sin tocar código.
4. **Optimización y SEO**: Meta tags dinámicos por producto con OpenGraph, archivo `robots.txt` configurado y `sitemap.xml`.
5. **Almacenamiento en Cloudinary**: Carga, recorte y distribución optimizada de imágenes para las botellas y etiquetas.
6. **Manejo de Stock Inteligente**: Priorización visual en catálogo de etiquetas con stock positivo y prevención de sobreventa.

---

## 🔒 Buenas Prácticas y Seguridad

- **Bcryptjs**: Contraseñas encriptadas con salting seguro.
- **JWT**: Tokens de acceso de corta duración (15 min) respaldados por refresh tokens revocables almacenados en base de datos.
- **Rate Limiting**: Protección en endpoints de login y registro contra ataques de fuerza bruta.
- **Zod**: Validación y tipado estricto en el backend para todos los payloads de entrada.
- **Helmet & CORS**: Protección de encabezados HTTP y configuración selectiva de orígenes permitidos.
- **Prisma ORM**: Consultas parametrizadas que mitigan inyecciones SQL.

---

## 📣 Meta Ads (Píxel + API de Conversiones)

Los eventos se envían **por duplicado**: desde el navegador (Píxel, `frontend/src/lib/meta.js`) y desde el servidor (API de Conversiones, vía `POST /api/meta/events` → `backend/src/services/meta.service.js`), **con el mismo `event_id`** para que Meta los deduplique. Los datos personales (email, teléfono, nombre) se envían hasheados con SHA-256 desde el backend. Nada se mide en las rutas `/admin`, y un fallo en el tracking nunca afecta la compra.

| Evento | Cuándo se dispara | Dónde |
|--------|-------------------|-------|
| `PageView` | Cada cambio de ruta pública (solo navegador) | `MetaPixelTracker.jsx` |
| `ViewContent` | Al cargar la ficha de un producto | `ProductPage.jsx` |
| `AddToCart` | Al agregar unidades efectivamente al carrito (respeta stock) | `CartContext.jsx` |
| `InitiateCheckout` | Una vez al entrar al checkout con carrito válido | `CheckoutPage.jsx` |
| `Purchase` | Al crearse el pedido, antes de abrir WhatsApp. `event_id = order-<id>` | `CheckoutForm.jsx` |
| `Contact` | Soportado por el endpoint; hoy no hay botones de WhatsApp fuera del checkout | — |

**Cómo probar:**
1. En el Administrador de eventos de Meta → tu Píxel → **Probar eventos**, copiá el código de prueba (ej. `TEST12345`).
2. Cargalo en `META_TEST_EVENT_CODE` en el backend y reiniciá/redeployá.
3. Navegá el sitio (con la extensión *Meta Pixel Helper* podés ver los eventos del navegador). En "Probar eventos" deberían aparecer los eventos de **Navegador** y **Servidor**, marcados como deduplicados.
4. Al terminar, **eliminá `META_TEST_EVENT_CODE`** y redeployá.

---

## 🚢 Despliegue en Producción

El repositorio ya incluye los archivos `vercel.json` en frontend y backend:

1. **Frontend (Vercel)**:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Configurar `VITE_API_URL` apuntando al backend en producción (terminando en `/api`) y `VITE_META_PIXEL_ID`.

2. **Backend (Vercel / Render / Railway)**:
   - Root directory: `backend`
   - Configurar variables de entorno (`DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_*`, `WHATSAPP_PHONE`, `CORS_ORIGIN`, `META_PIXEL_ID`, `META_ACCESS_TOKEN`, `META_API_VERSION`).
   - `CORS_ORIGIN` debe coincidir exactamente con el dominio del frontend (ej. `https://www.todo-vinos.online`).
   - Ejecutar `npx prisma db push` o migraciones sobre la base de datos de producción (PostgreSQL).
