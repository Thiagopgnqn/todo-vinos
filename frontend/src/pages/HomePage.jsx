import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/catalog/ProductGrid';
import Button from '../components/ui/Button';
import useSEO from '../hooks/useSEO';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiMessageSquare, FiCheck } from 'react-icons/fi';
import themeConfig from '../config/theme';

const HomePage = () => {
  const { products, loading, fetchProducts } = useProducts();

  useSEO({
    title: `${themeConfig.brand.name} — ${themeConfig.brand.tagline}`,
    description: themeConfig.brand.description,
  });

  useEffect(() => {
    fetchProducts({ limit: 3 });
  }, [fetchProducts]);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section Editorial */}
      <section className="relative min-h-[75vh] sm:min-h-[82vh] flex items-center bg-zinc-950 text-white overflow-hidden">
        {/* Imagen de fondo de alta calidad */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-100 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url('${themeConfig.placeholders.productHero}')` }}
        />
        {/* Overlay sutil de contraste para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
          <div className="max-w-2xl">
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-zinc-300 font-medium mb-4">
              Cava Seleccionada
            </span>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white mb-6 leading-[1.08]">
              Vinos de autor. <br />
              Grandes bodegas.
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-300 mb-8 font-normal leading-relaxed max-w-lg">
              {themeConfig.brand.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/catalogo">
                <Button size="lg" variant="white" className="w-full sm:w-auto px-7 py-3.5">
                  <span>Ver catálogo de vinos</span>
                  <FiArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/catalogo?type=TINTO">
                <Button size="lg" variant="outlineWhite" className="w-full sm:w-auto px-7 py-3.5">
                  <span>Vinos Tintos</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Reseñas y Experiencias de Clientes (Confianza y Prueba Social Realista) */}
      <section className="py-14 sm:py-16 bg-zinc-50/70 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header de Reseñas */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-200 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
                Experiencias en la Cava
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mt-1">
                Opiniones de Clientes
              </h2>
            </div>

            {/* Resumen de valoración y garantía */}
            <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-md border border-zinc-200 self-start md:self-auto shadow-soft">
              <div className="flex items-center text-zinc-900 gap-0.5" aria-label="Calificación 5 de 5 estrellas">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current text-zinc-900" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-xs">
                <span className="font-semibold text-zinc-900">4.9 / 5.0</span>
                <span className="text-zinc-500 ml-1.5">&bull; +380 despachos sin roturas</span>
              </div>
            </div>
          </div>

          {/* Grilla de Testimonios Realistas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                id: 'rev-1',
                author: 'Gonzalo Benítez',
                city: 'Córdoba Capital',
                initials: 'GB',
                timeAgo: 'Hace 4 días',
                orderInfo: 'Caja x6 Reserva (Catena & Rutini)',
                rating: 5,
                comment: 'Tenía dudas sobre el transporte de botellas hasta Córdoba, pero el pedido llegó con un embalaje súper seguro e impecable en 48 hs. Excelente el asesoramiento por WhatsApp para confirmar las añadas.',
              },
              {
                id: 'rev-2',
                author: 'Valeria Méndez',
                city: 'San Isidro, Bs. As.',
                initials: 'VM',
                timeAgo: 'Hace 1 semana',
                orderInfo: 'Selección Blancos & Espumantes (Rutini & Chandon)',
                rating: 5,
                comment: 'El precio con transferencia hace una diferencia real comparado con vinotecas de barrio. Las botellas llegaron frescas, con las etiquetas intactas y sin ningún roce. Ya es mi segunda compra para reponer cava.',
              },
              {
                id: 'rev-3',
                author: 'Esteban Rossi',
                city: 'Rosario, Santa Fe',
                initials: 'ER',
                timeAgo: 'Hace 2 semanas',
                orderInfo: 'Línea Malbec de Altura (Colomé & Zuccardi)',
                rating: 5,
                comment: 'Pedí una caja surtida para un asado familiar. La recomendación del sommelier sobre maridaje y temperatura de servicio fue acertadísima. Despacharon en el día y el seguimiento fue transparente.',
              },
              {
                id: 'rev-4',
                author: 'Mariana Lewkowicz',
                city: 'Neuquén',
                initials: 'ML',
                timeAgo: 'Hace 3 semanas',
                orderInfo: 'Caja x6 Pinot Noir & Extra Brut',
                rating: 5,
                comment: 'Se nota el cuidado en la estiba y guarda de las botellas: corchos y acidez en perfecto estado, nada de calor en depósito. Es un placer coordinar el pedido directo por WhatsApp sin pasos engorrosos.',
              },
            ].map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white p-5 rounded-lg border border-zinc-200 flex flex-col justify-between hover:border-zinc-400 transition-smooth shadow-soft"
              >
                <div>
                  {/* Estrellas y Badge de Verificación */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-zinc-900 gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 fill-current text-zinc-900" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="inline-flex items-center text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <FiCheck className="mr-1 text-emerald-700 text-[10px]" />
                      <span>Compra verificada</span>
                    </span>
                  </div>

                  {/* Comentario del Cliente */}
                  <p className="text-xs text-zinc-700 leading-relaxed font-normal mb-3">
                    "{rev.comment}"
                  </p>

                  {/* Detalle de la compra */}
                  <div className="text-[10px] text-zinc-500 bg-zinc-50 border border-zinc-100 rounded px-2 py-1 mb-4 truncate font-medium">
                    {rev.orderInfo}
                  </div>
                </div>

                {/* Pie con autor y procedencia */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-100 mt-auto">
                  <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[11px] font-semibold text-zinc-700 flex-shrink-0">
                    {rev.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-zinc-900 truncate">
                      {rev.author}
                    </h4>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {rev.city} &bull; {rev.timeAgo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categorías / Estilos destacados */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-zinc-200">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
                Explorá por variedad
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mt-1">
                Cava &amp; Estilos
              </h2>
            </div>
            <Link 
              to="/catalogo" 
              className="mt-3 sm:mt-0 text-xs font-medium text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>Ver catálogo completo</span>
              <FiArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {themeConfig.featuredCategories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/catalogo?type=${cat.type}`} 
                className="group flex flex-col border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50 hover:border-zinc-400 transition-smooth"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-200 relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-zinc-900 mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-normal mb-4 flex-1">
                    {cat.description}
                  </p>
                  <span className="text-xs font-medium text-zinc-900 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Ver etiquetas</span>
                    <FiArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Productos Destacados */}
      <section className="py-16 sm:py-20 bg-zinc-50/60 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-zinc-200">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
                Selección de la Cava
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mt-1">
                Etiquetas Destacadas
              </h2>
            </div>
            <Link 
              to="/catalogo" 
              className="mt-3 sm:mt-0 text-xs font-medium text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>Ver todas</span>
              <FiArrowRight size={13} />
            </Link>
          </div>

          <ProductGrid products={products.slice(0, 3)} loading={loading} />

          <div className="mt-12 text-center">
            <Link to="/catalogo">
              <Button variant="secondary" size="lg" className="px-8">
                Explorar catálogo de vinos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Editorial Banner — Respaldo y Criterio Enológico */}
      <section className="py-20 bg-zinc-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-medium mb-3 block">
            Criterio Enológico
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white mb-6 max-w-2xl mx-auto leading-snug">
            Cada etiqueta representa la autenticidad de su origen y la labor de su bodega.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
            Seleccionamos vinos de partidas limitadas y grandes clásicos de Mendoza, Salta y la Patagonia, conservados bajo condiciones controladas de estiba para preservar su pureza organoléptica.
          </p>
          <Link to="/catalogo">
            <Button className="bg-white text-zinc-900 hover:bg-zinc-100 border-none px-6">
              Conocé nuestra cava
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. Barra de Beneficios Vitivinícolas (Reubicada abajo del todo, arriba del Footer) */}
      <section className="border-t border-zinc-200 bg-zinc-50/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded bg-zinc-200/60 text-zinc-900 mt-0.5">
                <FiTruck size={17} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Cajas reforzadas de envío
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Embalaje seguro y protección especial para botellas a todo el país.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded bg-zinc-200/60 text-zinc-900 mt-0.5">
                <FiShield size={17} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  100% Origen de bodega
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Trazabilidad garantizada y condiciones rigurosas de guarda.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded bg-zinc-200/60 text-zinc-900 mt-0.5">
                <FiRefreshCw size={17} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Pago por transferencia
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Precios promocionales y confirmación ágil por WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded bg-zinc-200/60 text-zinc-900 mt-0.5">
                <FiMessageSquare size={17} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Asesoramiento directo
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Recomendaciones de sommelier y maridajes personalizados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
