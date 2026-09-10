import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { FaTimes, FaCheck, FaTrash } from 'react-icons/fa';

const FilterSidebar = ({ filters, setFilters, isOpen, onClose }) => {
  const types = [
    { label: 'Tinto', value: 'TINTO', icon: '🍷' },
    { label: 'Blanco', value: 'BLANCO', icon: '🥂' },
    { label: 'Rosado', value: 'ROSADO', icon: '🌸' },
    { label: 'Espumante', value: 'ESPUMANTE', icon: '✨' },
  ];
  const varietals = ['Malbec', 'Cabernet Sauvignon', 'Chardonnay', 'Torrontés', 'Pinot Noir', 'Syrah'];

  // Local state for price inputs to avoid fetching on every keystroke
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    setLocalMinPrice(filters.minPrice || '');
    setLocalMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const handleTypeChange = (typeValue) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(typeValue)
      ? currentTypes.filter(t => t !== typeValue)
      : [...currentTypes, typeValue];
    setFilters(prev => ({ ...prev, type: newTypes, page: 1 }));
  };

  const handleVarietalChange = (varietal) => {
    const currentVarietals = filters.varietal ? filters.varietal.split(',') : [];
    const newVarietals = currentVarietals.includes(varietal)
      ? currentVarietals.filter(v => v !== varietal)
      : [...currentVarietals, varietal];
    setFilters(prev => ({ 
      ...prev, 
      varietal: newVarietals.length ? newVarietals.join(',') : undefined,
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
      {/* Wine Type */}
      <div>
        <h4 className="font-playfair font-semibold text-base sm:text-lg text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
          <span>Tipo de Vino</span>
          {filters.type?.length > 0 && (
            <span className="text-xs bg-wine text-white px-2 py-0.5 rounded-full font-sans font-bold">
              {filters.type.length}
            </span>
          )}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
          {types.map(type => {
            const isChecked = (filters.type || []).includes(type.value);
            return (
              <label 
                key={type.value} 
                className={`flex items-center p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                  isChecked 
                    ? 'border-wine bg-wine/5 text-wine font-semibold shadow-xs' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-wine focus:ring-wine h-4 w-4"
                  checked={isChecked}
                  onChange={() => handleTypeChange(type.value)}
                />
                <span className="ml-2.5 text-sm flex items-center">
                  <span className="mr-1.5">{type.icon}</span>
                  <span>{type.label}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Varietal */}
      <div>
        <h4 className="font-playfair font-semibold text-base sm:text-lg text-gray-900 mb-3 pb-2 border-b border-gray-100">
          Varietal
        </h4>
        <div className="flex flex-wrap gap-1.5 sm:flex-col sm:space-y-1">
          {varietals.map(varietal => {
            const isSelected = (filters.varietal || '').split(',').includes(varietal);
            return (
              <label 
                key={varietal} 
                className={`flex items-center px-3 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer select-none ${
                  isSelected 
                    ? 'border-wine bg-wine text-white font-medium' 
                    : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden sm:inline rounded border-gray-300 text-wine focus:ring-wine h-4 w-4"
                  checked={isSelected}
                  onChange={() => handleVarietalChange(varietal)}
                />
                <span className="sm:ml-2 font-medium">{varietal}</span>
              </label>
            );
          })}
        </div>
      </div>
      
      {/* Price Range */}
      <div>
        <h4 className="font-playfair font-semibold text-base sm:text-lg text-gray-900 mb-3 pb-2 border-b border-gray-100">
          Rango de Precio
        </h4>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-gray-400">$</span>
            <input
              type="number"
              placeholder="Mínimo"
              className="w-full pl-6 pr-2 py-2 text-sm rounded-lg border-gray-300 focus:border-wine focus:ring-wine"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              onBlur={applyPrices}
              onKeyDown={(e) => e.key === 'Enter' && applyPrices()}
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-gray-400">$</span>
            <input
              type="number"
              placeholder="Máximo"
              className="w-full pl-6 pr-2 py-2 text-sm rounded-lg border-gray-300 focus:border-wine focus:ring-wine"
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
          className="mt-2.5 w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
        >
          Aplicar Rango de Precio
        </button>
      </div>

      <div className="pt-2">
        <button 
          type="button" 
          onClick={clearFilters}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <FaTrash className="mr-2 text-xs" />
          Limpiar todos los filtros
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer (Bottom Sheet or Side Slide) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={onClose} 
          />
          
          {/* Sheet */}
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white h-full shadow-2xl flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🍷</span>
                <h3 className="font-playfair text-xl font-bold text-gray-900">Filtros de Vinos</h3>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-700 p-2 rounded-lg" 
                onClick={onClose}
                aria-label="Cerrar filtros"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {content}
            </div>

            {/* Drawer Sticky Footer on Mobile */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex space-x-3">
              <Button 
                variant="primary" 
                fullWidth 
                size="lg" 
                onClick={onClose}
                className="shadow-md"
              >
                Ver Resultados
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          {content}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
