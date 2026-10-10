import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/catalog/ProductGrid';
import FilterSidebar from '../components/catalog/FilterSidebar';
import SearchBar from '../components/catalog/SearchBar';
import useSEO from '../hooks/useSEO';
import { FiSliders, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import themeConfig from '../config/theme';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, fetchProducts, pagination } = useProducts();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const isFirstRender = useRef(true);

  const [filters, setFilters] = useState(() => {
    const init = {};
    if (searchParams.get('type')) init.type = searchParams.get('type').split(',');
    if (searchParams.get('varietal')) init.varietal = searchParams.get('varietal');
    if (searchParams.get('search')) init.search = searchParams.get('search');
    if (searchParams.get('minPrice')) init.minPrice = searchParams.get('minPrice');
    if (searchParams.get('maxPrice')) init.maxPrice = searchParams.get('maxPrice');
    if (searchParams.get('sort')) init.sort = searchParams.get('sort');
    return init;
  });

  // Sync filters cuando cambian por la URL externamente
  useEffect(() => {
    const urlType = searchParams.get('type');
    const currentType = filters.type?.join(',') || '';
    if (urlType !== currentType) {
      setFilters(prev => ({
        ...prev,
        type: urlType ? urlType.split(',') : undefined,
      }));
    }
  }, [searchParams]);

  // SEO dinámico
  const typeFilterText = filters.type?.length === 1 ? `Vinos ${filters.type[0]}` : null;
  const pageTitle = typeFilterText
    ? `${typeFilterText} — Cava | ${themeConfig.brand.name}`
    : `Catálogo de Vinos | ${themeConfig.brand.name}`;

  useSEO({
    title: pageTitle,
    description: `Explorá nuestra selección de ${typeFilterText || 'vinos de autor y bodegas seleccionadas'}. Envíos en cajas reforzadas a todo el país.`,
  });

  const activeFiltersCount = (filters.type?.length || 0) + 
    (filters.varietal ? filters.varietal.split(',').length : 0) + 
    (filters.minPrice || filters.maxPrice ? 1 : 0);

  const PAGE_SIZE = 9;

  useEffect(() => {
    const params = { ...filters };
    if (params.type && params.type.length) params.type = params.type.join(',');
    else delete params.type;

    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined || params[key] === null) {
        delete params[key];
      }
    });

    if (!isFirstRender.current) {
      setSearchParams(params, { replace: true });
    }
    isFirstRender.current = false;

    // Fetch all matching products so we can partition in-stock vs out-of-stock globally across all pages
    const apiParams = { ...params, limit: 1000 };
    delete apiParams.page;
    fetchProducts(apiParams);
  }, [filters.type, filters.varietal, filters.search, filters.minPrice, filters.maxPrice, filters.sort, fetchProducts]);

  // Global sort: in-stock items first, out-of-stock items at the very end of the entire catalog
  const sortedProducts = React.useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return [...products].sort((a, b) => {
      const aInStock = Number(a?.stock) > 0 ? 1 : 0;
      const bInStock = Number(b?.stock) > 0 ? 1 : 0;
      if (aInStock !== bInStock) {
        return bInStock - aInStock; // In-stock (1) before out-of-stock (0)
      }
      return 0; // Keep current ordering
    });
  }, [products]);

  const currentPage = filters.page ? Math.max(1, parseInt(filters.page, 10)) : 1;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const currentProducts = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedProducts.slice(start, start + PAGE_SIZE);
  }, [sortedProducts, currentPage]);

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleRemoveType = (t) => {
    setFilters(prev => ({
      ...prev,
      type: (prev.type || []).filter(item => item !== t),
      page: 1,
    }));
  };

  const handleRemoveVarietal = (v) => {
    const current = (filters.varietal || '').split(',').filter(item => item !== v);
    setFilters(prev => ({
      ...prev,
      varietal: current.length ? current.join(',') : undefined,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Título de página y barra de búsqueda */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
              Cava Seleccionada
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mt-1">
              Catálogo de Vinos
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'etiqueta disponible' : 'etiquetas disponibles'}
            </p>
          </div>
          
          <div className="w-full md:w-80">
            <SearchBar initialQuery={filters.search} onSearch={handleSearch} />
          </div>
        </div>

        {/* Toolbar de Filtros Mobile y Ordenamiento */}
        <div className="flex items-center justify-between gap-3 mt-4">
          <button 
            className="flex-1 lg:hidden flex items-center justify-center space-x-2 py-2 px-3 bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 hover:border-zinc-300 transition-colors"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <FiSliders className="text-zinc-600 text-xs" />
            <span>Filtrar</span>
            {activeFiltersCount > 0 && (
              <span className="bg-zinc-900 text-white text-[10px] font-semibold px-1.5 py-0.2 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex-1 sm:flex-none flex items-center space-x-2 ml-auto">
            <div className="relative w-full sm:w-auto">
              <select 
                className="w-full rounded-md border-zinc-200 text-xs text-zinc-800 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 py-2 pl-3 pr-8 bg-white shadow-soft"
                value={filters.sort || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              >
                <option value="">Ordenar: Destacados</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="newest">Más Recientes</option>
                <option value="best_selling">Más Vendidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chips de Filtros Activos */}
        {(filters.type?.length > 0 || filters.varietal || filters.minPrice || filters.maxPrice || filters.search) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-zinc-100">
            <span className="text-xs text-zinc-400 mr-1 font-normal">Filtros aplicados:</span>
            
            {filters.type?.map(t => (
              <span key={t} className="inline-flex items-center text-xs bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded border border-zinc-200">
                {t}
                <button onClick={() => handleRemoveType(t)} className="ml-1.5 text-zinc-400 hover:text-zinc-900">
                  <FiX size={11} />
                </button>
              </span>
            ))}

            {filters.varietal?.split(',').map(v => (
              <span key={v} className="inline-flex items-center text-xs bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded border border-zinc-200">
                {v}
                <button onClick={() => handleRemoveVarietal(v)} className="ml-1.5 text-zinc-400 hover:text-zinc-900">
                  <FiX size={11} />
                </button>
              </span>
            ))}

            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center text-xs bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded border border-zinc-200">
                ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                <button onClick={() => setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }))} className="ml-1.5 text-zinc-400 hover:text-zinc-900">
                  <FiX size={11} />
                </button>
              </span>
            )}

            {filters.search && (
              <span className="inline-flex items-center text-xs bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded border border-zinc-200">
                "{filters.search}"
                <button onClick={() => setFilters(prev => ({ ...prev, search: undefined }))} className="ml-1.5 text-zinc-400 hover:text-zinc-900">
                  <FiX size={11} />
                </button>
              </span>
            )}

            <button 
              onClick={() => setFilters({})} 
              className="text-xs text-zinc-500 hover:text-zinc-900 underline ml-2 font-medium"
            >
              Borrar todos
            </button>
          </div>
        )}
      </div>

      {/* Grilla Principal y Filtros */}
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          isOpen={isMobileFiltersOpen} 
          onClose={() => setIsMobileFiltersOpen(false)} 
        />
        <div className="flex-1">
          <ProductGrid products={currentProducts} loading={loading} />
          
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-zinc-200">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded border border-zinc-200 bg-white text-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
                aria-label="Página anterior"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="text-xs text-zinc-600 px-3">
                Página <strong className="text-zinc-900 font-semibold">{currentPage}</strong> de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded border border-zinc-200 bg-white text-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
                aria-label="Página siguiente"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
