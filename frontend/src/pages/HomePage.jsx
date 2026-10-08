import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/catalog/ProductGrid';
import Button from '../components/ui/Button';
import useSEO from '../hooks/useSEO';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiMessageSquare } from 'react-icons/fi';
import themeConfig from '../config/theme';

const HomePage = () => {
  const { products, loading, fetchProducts } = useProducts();

  useSEO({
    title: `${themeConfig.brand.name} — ${themeConfig.brand.tagline}`,
    description: themeConfig.brand.description,
  });

  useEffect(() => {
    fetchProducts({ limit: 4 });
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
              Colección Actual
            </span>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white mb-6 leading-[1.08]">
              Diseño sobrio. <br />
              Hecho para durar.
            </h1>
            
            <p className="text-sm sm:text-base text-zinc-300 mb-8 font-normal leading-relaxed max-w-lg">
              {themeConfig.brand.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/catalogo">
                <Button size="lg" className="w-full sm:w-auto bg-white text-zinc-950 hover:bg-zinc-100 border-none px-6">
                  <span>Ver catálogo</span>
                  <FiArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/catalogo?type=TINTO">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Línea Clásica
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Barra de Beneficios (Simple, sobria, sin repeticiones) */}
      <section className="border-b border-zinc-200 bg-zinc-50/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded bg-zinc-200/60 text-zinc-900 mt-0.5">
                <FiTruck size={17} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Envíos a todo el país
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Despachos con seguimiento y embalaje seguro.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded bg-zinc-200/60 text-zinc-900 mt-0.5">
                <FiShield size={17} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Compra garantizada
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Artículos nuevos y certificados con control previo.
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
                  Precios promocionales y confirmación ágil.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded bg-zinc-200/60 text-zinc-900 mt-0.5">
                <FiMessageSquare size={17} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Atención directa
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Canal de asesoramiento inmediato vía WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categorías / Líneas destacadas */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-zinc-200">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
                Explorá por línea
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mt-1">
                Colecciones
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
                    <span>Ver piezas</span>
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
                Selección de piezas
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mt-1">
                Destacados
              </h2>
            </div>
            <Link 
              to="/catalogo" 
              className="mt-3 sm:mt-0 text-xs font-medium text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>Ver todos</span>
              <FiArrowRight size={13} />
            </Link>
          </div>

          <ProductGrid products={products.slice(0, 4)} loading={loading} />

          <div className="mt-12 text-center">
            <Link to="/catalogo">
              <Button variant="secondary" size="lg" className="px-8">
                Explorar catálogo completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Editorial Banner — Respaldo y Filosofía de Diseño */}
      <section className="py-20 bg-zinc-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-medium mb-3 block">
            Criterio de Selección
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white mb-6 max-w-2xl mx-auto leading-snug">
            Cada artículo responde a una función clara y a una construcción exigente.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
            Seleccionamos productos que resisten el paso del tiempo, priorizando materiales nobles, líneas limpias y una experiencia de uso sin artificios.
          </p>
          <Link to="/catalogo">
            <Button className="bg-white text-zinc-900 hover:bg-zinc-100 border-none px-6">
              Conocé las colecciones
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
