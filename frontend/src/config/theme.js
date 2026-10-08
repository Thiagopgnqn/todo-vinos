/**
 * CONFIGURACIÓN CENTRAL DE MARCA Y TEMA
 * 
 * Para personalizar esta tienda para cualquier rubro (moda, tecnología, café, cosmética, etc.):
 * 1. Modificá los datos de `brand` (nombre, descripción, logo).
 * 2. Ajustá los colores en `colors` (o las variables CSS en index.css).
 * 3. Actualizá `benefits`, `categories` y `socialLinks`.
 */

export const themeConfig = {
  // 1. Identidad de Marca
  brand: {
    name: 'ATELIER',
    tagline: 'Objetos y esenciales de diseño contemporáneo',
    description: 'Catálogo curado con altos estándares de fabricación, durabilidad y simpleza estética.',
    currencySymbol: '$',
    currencyCode: 'ARS',
    minOrderUnits: 6, // Sincronizado con validación de backend
    unitName: 'unidad',
    unitNamePlural: 'unidades',
  },

  // 2. Navegación principal
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Colección A', href: '/catalogo?type=TINTO' },
    { label: 'Colección B', href: '/catalogo?type=BLANCO' },
    { label: 'Colección C', href: '/catalogo?type=ESPUMANTE' },
  ],

  // 3. Beneficios / Propuestas de valor (sin clichés, directas y claras)
  benefits: [
    {
      id: 'shipping',
      title: 'Despacho a todo el país',
      description: 'Embalaje técnico reforzado y seguimiento directo hasta la entrega.',
    },
    {
      id: 'payment',
      title: 'Pago seguro y ágil',
      description: 'Precios preferenciales por transferencia y confirmación inmediata.',
    },
    {
      id: 'guarantee',
      title: 'Garantía de satisfacción',
      description: 'Control de calidad en cada artículo previo a su preparación.',
    },
    {
      id: 'support',
      title: 'Atención personalizada',
      description: 'Asesoramiento directo y soporte de posventa vía WhatsApp.',
    },
  ],

  // 4. Categorías destacadas para la Home (Neutrales y elegantes)
  featuredCategories: [
    {
      id: 'cat-1',
      type: 'TINTO',
      title: 'Línea Clásica',
      description: 'Piezas esenciales de alta durabilidad y carácter atemporal.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-2',
      type: 'BLANCO',
      title: 'Línea Contemporánea',
      description: 'Acabados ligeros, proporciones limpias y enfoque minimalista.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-3',
      type: 'ROSADO',
      title: 'Edición Especial',
      description: 'Tiradas limitadas con materiales seleccionados y detalles de autor.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-4',
      type: 'ESPUMANTE',
      title: 'Colección Exclusiva',
      description: 'Diseño superior pensado para ocasiones y espacios distinguidos.',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    },
  ],

  // 5. Imágenes de reserva neutrales (fallback cuando un producto no tiene foto)
  placeholders: {
    productHero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
    productCard: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    editorialBanner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
  },

  // 6. Contacto y Redes
  contact: {
    location: 'Envíos a todo el territorio nacional',
    phone: '+54 9 2996 28-4585',
    hours: 'Lunes a Sábados de 09:00 a 20:00 hs',
    email: 'contacto@tienda.com',
  },

  // 7. Footer y Datos Legales
  legal: {
    copyright: `© ${new Date().getFullYear()} ATELIER. Todos los derechos reservados.`,
    note: 'Comercio electrónico independiente. Venta directa y distribución oficial.',
  },
};

export default themeConfig;
