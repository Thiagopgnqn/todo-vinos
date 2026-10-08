/**
 * CONFIGURACIÓN CENTRAL DE MARCA Y TEMA — TODO VINOS
 * 
 * Mantiene la estética sobria, moderna y profesional del sistema de diseño,
 * adaptada con precisión editorial al rubro vitivinícola.
 */

export const themeConfig = {
  // 1. Identidad de Marca
  brand: {
    name: 'TODO VINOS',
    tagline: 'Cava Online & Bodegas Seleccionadas',
    description: 'Colección curada de bodegas seleccionadas y etiquetas de autor de Argentina. Envíos con embalaje seguro a todo el país.',
    currencySymbol: '$',
    currencyCode: 'ARS',
    minOrderUnits: 6, // Sincronizado con validación de backend y cajas de 6 botellas
    unitName: 'botella',
    unitNamePlural: 'botellas',
  },

  // 2. Navegación principal
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Tintos', href: '/catalogo?type=TINTO' },
    { label: 'Blancos', href: '/catalogo?type=BLANCO' },
    { label: 'Rosados', href: '/catalogo?type=ROSADO' },
    { label: 'Espumantes', href: '/catalogo?type=ESPUMANTE' },
  ],

  // 3. Beneficios / Propuestas de valor para vinoteca (claras, concisas y sin clichés)
  benefits: [
    {
      id: 'shipping',
      title: 'Cajas reforzadas de envío',
      description: 'Embalaje seguro y protección especial para botellas a todo el país.',
    },
    {
      id: 'payment',
      title: 'Precio especial por transferencia',
      description: 'Precios promocionales directos con confirmación ágil por WhatsApp.',
    },
    {
      id: 'guarantee',
      title: '100% Origen de bodega',
      description: 'Trazabilidad garantizada y condiciones rigurosas de guarda y estiba.',
    },
    {
      id: 'support',
      title: 'Asesoramiento de sommelier',
      description: 'Atención personalizada para recomendaciones de maridaje y ocasiones.',
    },
  ],

  // 4. Categorías de vinos para la Home
  featuredCategories: [
    {
      id: 'cat-tintos',
      type: 'TINTO',
      title: 'Vinos Tintos',
      description: 'Malbec, Cabernet Sauvignon, Cabernet Franc y cortes con estructura y carácter.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-blancos',
      type: 'BLANCO',
      title: 'Vinos Blancos',
      description: 'Chardonnay, Sauvignon Blanc y Torrontés salteño de gran frescura y mineralidad.',
      image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-rosados',
      type: 'ROSADO',
      title: 'Vinos Rosados',
      description: 'Sutileza, perfil floral y acidez refrescante de cosecha temprana.',
      image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-espumantes',
      type: 'ESPUMANTE',
      title: 'Espumantes',
      description: 'Burbujas finas obtenidas mediante método tradicional y charmat.',
      image: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=800&q=80',
    },
  ],

  // 5. Imágenes de reserva y fotografía editorial
  placeholders: {
    productHero: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1920&q=80',
    productCard: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    editorialBanner: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1600&q=80',
  },

  // 6. Contacto y Redes
  contact: {
    location: 'Envíos asegurados a todo el territorio nacional',
    phone: '+54 9 2996 28-4585',
    hours: 'Lunes a Sábados de 10:00 a 20:00 hs',
    email: 'contacto@todovinos.com',
  },

  // 7. Footer y Datos Legales
  legal: {
    copyright: `© ${new Date().getFullYear()} Todo Vinos. Todos los derechos reservados.`,
    note: 'Beber con moderación. Prohibida su venta a menores de 18 años.',
  },
};

export default themeConfig;
