import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/catalog/ProductGrid';
import FilterSidebar from '../components/catalog/FilterSidebar';
import SearchBar from '../components/catalog/SearchBar';
import useSEO from '../hooks/useSEO';
import { FaFilter, FaTimes, FaSortAmountDown } from 'react-icons/fa';

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

  // Dynamic SEO based on active filters
  const typeFilterText = filters.type?.length === 1 ? `Vinos ${filters.type[0]}` : null;
  const pageTitle = typeFilterText
    ? `${typeFilterText} — Catálogo Online | Todo Vinos`
    : 'Catálogo de Vinos — Tintos, Blancos y Espumantes | Todo Vinos';

  useSEO({
    title: pageTitle,
    description: `Explorá nuestro catálogo de ${typeFilterText || 'vinos argentinos'}. Filtros por varietal, bodega y rango de precio. Envíos a todo el país.`,
    keywords: `catalogo de vinos, comprar vinos online, ${filters.type?.join(', ') || 'vinos tintos, vinos blancos, espumantes'}, bodega mendoza`,
  });

  // Calculate total active filters count
  const activeFiltersCount = (filters.type?.length || 0) + 
    (filters.varietal ? filters.varietal.split(',').length : 0) + 
    (filters.minPrice || filters.maxPrice ? 1 : 0);

  // Fetch products when filters change
  useEffect(() => {
    const params = { ...filters };
    if (params.type && params.type.length) params.type = params.type.join(',');
    else delete params.type;

    // Remove empty values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined || params[key] === null) {
        delete params[key];
      }
    });

    // Update URL without causing re-render loop
    if (!isFirstRender.current) {
      setSearchParams(params, { replace: true });
    }
    isFirstRender.current = false;

    fetchProducts(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, fetchProducts]);

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleRemoveType = (t) => {
    setFilters(prev => ({
      ...prev,
      type: (prev.type || []).filter(item => item !== t)
    }));
  };

  const handleRemoveVarietal = (v) => {
    const current = (filters.varietal || '').split(',').filter(item => item !== v);
    setFilters(prev => ({
      ...prev,
      varietal: current.length ? current.join(',') : undefined
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page Title & Search bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900">Catálogo de Vinos</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {products.length} {products.length === 1 ? 'vino disponible' : 'vinos disponibles'}
            </p>
          </div>
          
          <div className="w-full sm:w-80">
            <SearchBar initialQuery={filters.search} onSearch={handleSearch} />
          </div>
        </div>

        {/* Mobile Filter & Sort Toolbar */}
        <div className="flex items-center justify-between gap-3 mt-4">
          <button 
            className="flex-1 lg:hidden flex items-center justify-center space-x-2 py-2.5 px-4 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 shadow-xs hover:border-wine transition-colors active:scale-98"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <FaFilter className="text-wine text-xs" />
            <span>Filtrar</span>
            {activeFiltersCount > 0 && (
              <span className="bg-wine text-white text-[11px] font-bold px-2 py-0.2 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex-1 sm:flex-none flex items-center space-x-2">
            <div className="relative w-full sm:w-auto">
              <select 
                className="w-full rounded-xl border-gray-300 text-xs sm:text-sm font-medium focus:border-wine focus:ring-wine py-2.5 pl-3 pr-8 bg-white shadow-xs"
                value={filters.sort || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              >
                <option value="">Ordenar: Destacados</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="newest">Más Nuevos</option>
                <option value="best_selling">Más Vendidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Chips */}
        {(filters.type?.length > 0 || filters.varietal || filters.minPrice || filters.maxPrice || filters.search) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400 mr-1">Filtros activos:</span>
            
            {filters.type?.map(t => (
              <span key={t} className="inline-flex items-center text-xs bg-wine/10 text-wine font-medium px-2.5 py-1 rounded-full border border-wine/20">
                {t}
                <button onClick={() => handleRemoveType(t)} className="ml-1.5 text-wine/70 hover:text-wine"><FaTimes size={10} /></button>
              </span>
            ))}

            {filters.varietal?.split(',').map(v => (
              <span key={v} className="inline-flex items-center text-xs bg-amber-50 text-amber-800 font-medium px-2.5 py-1 rounded-full border border-amber-200">
                {v}
                <button onClick={() => handleRemoveVarietal(v)} className="ml-1.5 text-amber-600 hover:text-amber-800"><FaTimes size={10} /></button>
              </span>
            ))}

            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-full">
                ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                <button onClick={() => setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }))} className="ml-1.5 text-gray-500 hover:text-gray-700"><FaTimes size={10} /></button>
              </span>
            )}

            {filters.search && (
              <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full">
                "{filters.search}"
                <button onClick={() => setFilters(prev => ({ ...prev, search: undefined }))} className="ml-1.5 text-blue-500 hover:text-blue-700"><FaTimes size={10} /></button>
              </span>
            )}

            <button 
              onClick={() => setFilters({})} 
              className="text-xs text-wine underline ml-2 font-medium hover:text-wine/80"
            >
              Borrar todos
            </button>
          </div>
        )}
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          isOpen={isMobileFiltersOpen} 
          onClose={() => setIsMobileFiltersOpen(false)} 
        />
        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-xs"
              >
                &larr; Anterior
              </button>
              <span className="text-sm font-medium text-gray-700">
                {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-xs"
              >
                Siguiente &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
