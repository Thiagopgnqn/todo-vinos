import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import client from '../../api/client';
import { FiX, FiTrash2, FiSliders } from 'react-icons/fi';

const DEFAULT_TYPES = [
  { label: 'Tinto', value: 'Tinto' },
  { label: 'Blanco', value: 'Blanco' },
  { label: 'Rosado', value: 'Rosado' },
  { label: 'Espumante', value: 'Espumante' },
];

const FilterSidebar = ({ filters, setFilters, isOpen, onClose }) => {
  const [types, setTypes] = useState(DEFAULT_TYPES);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await client.get('/wine-types');
        if (res.data && res.data.length > 0) {
          const dynamicTypes = res.data.map(t => ({
            label: t.name,
            value: t.name,
          }));
          setTypes(dynamicTypes);
        }
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };
    fetchCategories();
  }, []);

  const variants = [
    'Malbec',
    'Cabernet Sauvignon',
    'Cabernet Franc',
    'Chardonnay',
    'Pinot Noir',
    'Torrontés',
    'Syrah',
    'Blend'
  ];

  // Estado local para los precios para evitar peticiones en cada tecla
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    setLocalMinPrice(filters.minPrice || '');
    setLocalMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const handleTypeChange = (typeValue) => {
    const currentTypes = filters.type || [];
    const exists = currentTypes.some(t => t.toLowerCase() === typeValue.toLowerCase());
    const newTypes = exists
      ? currentTypes.filter(t => t.toLowerCase() !== typeValue.toLowerCase())
      : [...currentTypes, typeValue];
    setFilters(prev => ({ ...prev, type: newTypes, page: 1 }));
  };

  const handleVariantChange = (variant) => {
    const currentVariants = filters.varietal ? filters.varietal.split(',') : [];
    const newVariants = currentVariants.includes(variant)
      ? currentVariants.filter(v => v !== variant)
      : [...currentVariants, variant];
    setFilters(prev => ({ 
      ...prev, 
      varietal: newVariants.length ? newVariants.join(',') : undefined,
      page: 1 
    }));
  };

  const applyPrices = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: localMinPrice || undefined,
      maxPrice: localMaxPrice || undefined,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setFilters({});
    if (onClose) onClose();
  };

  const content = (
    <div className="space-y-6">
      {/* 1. Categorías / Tipo de Vino */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200">
          <h4 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider">
            Tipo de Vino
          </h4>
          {filters.type?.length > 0 && (
            <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded-full font-semibold">
              {filters.type.length}
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {types.map(type => {
            const isChecked = (filters.type || []).some(t => t.toLowerCase() === type.value.toLowerCase());
            return (
              <label 
                key={type.value} 
                className={`flex items-center px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer select-none ${
                  isChecked 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="checkbox"
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 h-3.5 w-3.5"
                  checked={isChecked}
                  onChange={() => handleTypeChange(type.value)}
                />
                <span className="ml-2.5">{type.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Varietales / Cepas */}
      <div>
        <div className="pb-2 mb-3 border-b border-zinc-200">
          <h4 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider">
            Varietal / Cepa
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {variants.map(variant => {
            const isSelected = (filters.varietal || '').split(',').includes(variant);
            return (
              <button 
                key={variant} 
                type="button"
                onClick={() => handleVariantChange(variant)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  isSelected 
                    ? 'bg-zinc-900 text-white font-medium' 
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {variant}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 3. Rango de Precio */}
      <div>
        <div className="pb-2 mb-3 border-b border-zinc-200">
          <h4 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider">
            Rango de Precio
          </h4>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-zinc-400">$</span>
            <input
              type="number"
              placeholder="Mínimo"
              className="w-full pl-6 pr-2 py-1.5 text-xs rounded border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              onBlur={applyPrices}
              onKeyDown={(e) => e.key === 'Enter' && applyPrices()}
            />
          </div>
          <span className="text-zinc-400 text-xs">-</span>
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-zinc-400">$</span>
            <input
              type="number"
              placeholder="Máximo"
              className="w-full pl-6 pr-2 py-1.5 text-xs rounded border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              onBlur={applyPrices}
              onKeyDown={(e) => e.key === 'Enter' && applyPrices()}
            />
          </div>
        </div>
        <button 
          type="button" 
          onClick={applyPrices}
          className="mt-2.5 w-full py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded transition-colors"
        >
          Filtrar precio
        </button>
      </div>

      {/* Botón limpiar */}
      <div className="pt-2">
        <button 
          type="button" 
          onClick={clearFilters}
          className="w-full flex items-center justify-center py-2 px-3 border border-zinc-200 text-zinc-600 rounded text-xs font-medium hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
        >
          <FiTrash2 className="mr-1.5 text-xs" />
          Restablecer filtros
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Drawer Móvil */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={onClose} 
          />
          
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white h-full shadow-overlay flex flex-col justify-between border-l border-zinc-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
              <div className="flex items-center space-x-2">
                <FiSliders className="text-zinc-900 text-base" />
                <h3 className="font-semibold text-sm text-zinc-900">Filtros</h3>
              </div>
              <button 
                className="text-zinc-400 hover:text-zinc-900 p-1 rounded-md" 
                onClick={onClose} 
                aria-label="Cerrar filtros"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {content}
            </div>

            <div className="p-4 border-t border-zinc-200 bg-white">
              <Button 
                variant="primary" 
                fullWidth 
                size="md" 
                onClick={onClose}
              >
                Ver Resultados
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <div className="hidden lg:block lg:w-60 flex-shrink-0">
        <div className="sticky top-24 bg-white p-5 rounded-lg border border-zinc-200">
          {content}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
