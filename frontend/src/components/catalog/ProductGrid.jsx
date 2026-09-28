import React from 'react';
import ProductCard from './ProductCard';
import Spinner from '../ui/Spinner';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center">
        <Spinner size="lg" text="Cargando vinos seleccionados..." />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <span className="text-5xl block mb-3">🍷</span>
        <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">No encontramos vinos con estos filtros</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Probá quitando algunos filtros de búsqueda o buscando por otro varietal o bodega.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map(product => (
        <ProductCard key={product.id || product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
