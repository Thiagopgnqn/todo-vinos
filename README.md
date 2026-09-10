# 🍷 Todo Vinos — Tienda Online de Vinos

Tienda online de vinos con catálogo, carrito de compras y checkout vía WhatsApp.  
Panel de administración para gestionar productos y pedidos.

---

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd vinoteca
```

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example backend/.env
```

Editar `backend/.env` con tus valores:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Ruta a la base de datos SQLite | `file:./dev.db` |
| `JWT_ACCESS_SECRET` | Secreto para access tokens | (generar string aleatorio) |
| `JWT_REFRESH_SECRET` | Secreto para refresh tokens | (generar string aleatorio) |
| `JWT_ACCESS_EXPIRATION` | Duración del access token | `15m` |
| `JWT_REFRESH_EXPIRATION` | Duración del refresh token | `7d` |
| `WHATSAPP_PHONE` | Número de WhatsApp del dueño | `5491112345678` |
| `PORT` | Puerto del servidor backend | `3001` |
| `CORS_ORIGIN` | URL del frontend | `http://localhost:5173` |
| `ADMIN_EMAIL` | Email del admin inicial | `admin@todovinos.com` |
| `ADMIN_PASSWORD` | Contraseña del admin inicial | `Admin123!` |

### 3. Instalar dependencias e inicializar la base de datos

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
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

# Terminal 2 — Frontend (puerto 5173)
cd frontend
npm run dev
```

Abrir el navegador en **http://localhost:5173**

---

## 👤 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | `admin@todovinos.com` | `Admin123!` |

Los clientes pueden registrarse desde la app o comprar como invitados.

---

## 📁 Estructura de Archivos del Proyecto

```text
vinoteca/
├── backend/                               # Servidor Backend (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma                  # Esquema de la base de datos SQLite/PostgreSQL
│   │   ├── seed.js                        # Datos iniciales (usuario admin y vinos de prueba)
│   │   └── dev.db                         # Base de datos SQLite local
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                     # Carga y validación de variables de entorno
│   │   ├── controllers/                   # Controladores (manejo de requests HTTP)
│   │   │   ├── auth.controller.js         # Registro, login, refresh token, perfil
│   │   │   ├── order.controller.js        # Creación y gestión de pedidos
│   │   │   └── product.controller.js      # CRUD y catálogo de productos
│   │   ├── middleware/                    # Middlewares de Express
│   │   │   ├── admin.js                   # Verificación de rol de administrador
│   │   │   ├── auth.js                    # Autenticación JWT y optionalAuth
│   │   │   ├── errorHandler.js            # Manejador centralizado de errores
│   │   │   ├── rateLimiter.js             # Limitador de peticiones para seguridad
│   │   │   └── validate.js                # Validación de schemas con Zod
│   │   ├── routes/                        # Definición de endpoints de la API
│   │   │   ├── auth.routes.js             # Rutas de autenticación (/api/auth)
│   │   │   ├── order.routes.js            # Rutas de pedidos (/api/orders)
│   │   │   ├── product.routes.js          # Rutas de productos (/api/products)
│   │   │   └── upload.routes.js           # Subida de imágenes (/api/upload)
│   │   ├── services/                      # Lógica de negocio e interacción con BD
│   │   │   ├── auth.service.js            # Lógica de usuarios y tokens
│   │   │   ├── order.service.js           # Lógica de pedidos y stock
│   │   │   └── product.service.js         # Filtros, paginación y CRUD de vinos
│   │   ├── utils/
│   │   │   ├── jwt.js                     # Generación y verificación de tokens JWT
│   │   │   └── whatsapp.js                # Generador de enlaces y mensaje de WhatsApp
│   │   ├── validators/                    # Validaciones de esquemas con Zod
│   │   │   ├── auth.validator.js          # Validaciones para registro y login
│   │   │   ├── order.validator.js         # Validaciones para órdenes
│   │   │   └── product.validator.js       # Validaciones para productos
│   │   └── index.js                       # Entrada principal del servidor Express
│   ├── uploads/                           # Carpeta de almacenamiento de imágenes subidas
│   └── package.json                       # Dependencias y scripts del backend
│
├── frontend/                              # Aplicación Frontend (React + Vite + TailwindCSS)
│   ├── public/                            # Recursos estáticos públicos
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js                  # Instancia de Axios configurada con interceptores
│   │   ├── components/                    # Componentes modulares y reutilizables
│   │   │   ├── admin/                     # Componentes del panel de administración
│   │   │   │   ├── AdminSidebar.jsx       # Barra lateral de navegación admin (responsive)
│   │   │   │   ├── OrderTable.jsx         # Tabla y tarjetas de pedidos para admin
│   │   │   │   ├── ProductForm.jsx        # Formulario de alta/edición de vino con upload de foto
│   │   │   │   └── ProductTable.jsx       # Listado de productos con acciones de edición
│   │   │   ├── auth/                      # Formularios de autenticación
│   │   │   │   ├── LoginForm.jsx          # Formulario de inicio de sesión
│   │   │   │   └── RegisterForm.jsx       # Formulario de registro de cliente
│   │   │   ├── cart/                      # Componentes del carrito de compras
│   │   │   │   ├── CartDrawer.jsx         # Panel lateral deslizable del carrito
│   │   │   │   ├── CartItem.jsx           # Renglón individual de producto en carrito
│   │   │   │   └── CartSummary.jsx        # Resumen de subtotales y botón de checkout
│   │   │   ├── catalog/                   # Componentes del catálogo de vinos
│   │   │   │   ├── FilterSidebar.jsx      # Filtros por tipo, varietal y rango de precio
│   │   │   │   ├── ProductCard.jsx        # Tarjeta visual de producto
│   │   │   │   ├── ProductGrid.jsx        # Cuadrícula responsive de productos
│   │   │   │   └── SearchBar.jsx          # Barra de búsqueda en tiempo real
│   │   │   ├── checkout/                  # Proceso de finalización de compra
│   │   │   │   ├── AddressMap.jsx         # Mapa interactivo Leaflet para verificar dirección
│   │   │   │   └── CheckoutForm.jsx       # Formulario de contacto, entrega y checkout WhatsApp
│   │   │   ├── layout/                    # Estructura visual de la app
│   │   │   │   ├── Footer.jsx             # Pie de página institucional
│   │   │   │   ├── Header.jsx             # Barra superior con navegación y carrito
│   │   │   │   └── Layout.jsx             # Envoltura principal de página
│   │   │   └── ui/                        # Componentes UI básicos y reutilizables
│   │   │       ├── Badge.jsx              # Etiquetas de estado y categorías
│   │   │       ├── Button.jsx             # Botones estilizados
│   │   │       ├── Input.jsx              # Inputs y campos de formulario
│   │   │       ├── Modal.jsx              # Ventana modal reutilizable
│   │   │       ├── Select.jsx             # Desplegable estilizado
│   │   │       └── Spinner.jsx            # Indicador de carga
│   │   ├── context/                       # Contextos globales de React
│   │   │   ├── AuthContext.jsx            # Estado de usuario autenticado y token
│   │   │   └── CartContext.jsx            # Estado persistente del carrito de compras
│   │   ├── hooks/                         # Custom hooks
│   │   │   ├── useAuth.js                 # Acceso rápido al contexto de autenticación
│   │   │   ├── useCart.js                 # Acceso rápido al carrito
│   │   │   └── useProducts.js             # Hook para consulta de productos
│   │   ├── pages/                         # Vistas / Páginas de la aplicación
│   │   │   ├── admin/
│   │   │   │   ├── DashboardPage.jsx      # Panel principal con estadísticas de ventas
│   │   │   │   ├── OrdersPage.jsx         # Gestión de pedidos y estados
│   │   │   │   └── ProductsPage.jsx       # Gestión de inventario de vinos
│   │   │   ├── CartPage.jsx               # Vista completa del carrito
│   │   │   ├── CatalogPage.jsx            # Catálogo con filtros y búsqueda
│   │   │   ├── CheckoutPage.jsx           # Vista de confirmación de pedido
│   │   │   ├── HomePage.jsx               # Página de inicio / Landing
│   │   │   ├── LoginPage.jsx              # Vista de login
│   │   │   ├── NotFoundPage.jsx           # Vista 404
│   │   │   ├── ProductPage.jsx            # Detalle individual de un vino
│   │   │   └── RegisterPage.jsx           # Vista de registro de usuario
│   │   ├── App.jsx                        # Enrutador principal y rutas protegidas
│   │   ├── index.css                      # Estilos globales y directivas Tailwind
│   │   └── main.jsx                       # Punto de entrada de React
│   ├── index.html                         # Plantilla HTML con fuentes y título
│   ├── tailwind.config.js                 # Configuración de colores y tipografías
│   ├── vite.config.js                     # Configuración de Vite y proxies
│   └── package.json                       # Dependencias y scripts del frontend
│
├── .env.example                           # Plantilla de variables de entorno
├── .gitignore                             # Archivos y carpetas ignorados por git
└── README.md                              # Documentación del proyecto
```

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/register` | Público | Registrar usuario |
| POST | `/login` | Público | Iniciar sesión |
| POST | `/refresh` | Público | Renovar access token |
| POST | `/logout` | Autenticado | Cerrar sesión |

### Products (`/api/products`)
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/` | Público | Listar productos (filtros, búsqueda, paginación) |
| GET | `/:id` | Público | Detalle de producto |
| POST | `/` | Admin | Crear producto |
| PUT | `/:id` | Admin | Editar producto |
| DELETE | `/:id` | Admin | Eliminar producto (soft delete) |

### Orders (`/api/orders`)
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/` | Público | Crear pedido |
| GET | `/` | Admin | Listar pedidos |
| GET | `/:id` | Admin | Detalle de pedido |
| PATCH | `/:id/status` | Admin | Cambiar estado |

### Upload (`/api/upload`)
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/image` | Admin | Subir imagen |

---

## 🔒 Seguridad

- Contraseñas hasheadas con **bcrypt** (12 salt rounds)
- Autenticación con **JWT** (access token 15min + refresh token 7 días)
- **Rate limiting** en login y registro (5 intentos/minuto)
- Validación de datos con **Zod** en backend
- **Helmet** para headers de seguridad
- **CORS** configurado
- Queries parametrizadas vía **Prisma** (previene SQL injection)
- React escapa HTML por defecto (previene XSS)
- Variables sensibles en `.env` (nunca hardcodeadas)

---

## 📦 Tecnologías

| Capa | Stack |
|------|-------|
| Frontend | React 18, Vite, TailwindCSS, React Router v6, Axios |
| Backend | Node.js, Express, Prisma ORM |
| Base de Datos | SQLite (migrable a PostgreSQL) |
| Auth | JWT + bcrypt |
| Validación | Zod |

---

## 🍇 Datos de Ejemplo (Seed)

El seed incluye 8 vinos argentinos de ejemplo cubriendo:
- **Tintos**: Malbec, Cabernet Sauvignon, Blend
- **Blancos**: Torrontés, Chardonnay
- **Rosados**: Malbec Rosé
- **Espumantes**: Extra Brut, Brut Rosé

---

## 📝 Notas para Producción

- Cambiar `DATABASE_URL` a PostgreSQL (solo modificar el provider en `schema.prisma`)
- Generar secretos JWT seguros y aleatorios
- Configurar almacenamiento de imágenes en S3 o Cloudinary
- Habilitar HTTPS
- Configurar un reverse proxy (nginx)
- Establecer `CORS_ORIGIN` con el dominio real
- Actualizar `WHATSAPP_PHONE` con el número real del dueño

