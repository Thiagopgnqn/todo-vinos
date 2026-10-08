import React from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { FiShoppingBag } from 'react-icons/fi';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {[...Array(6)].map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center bg-zinc-50 rounded-lg border border-zinc-200">
        <FiShoppingBag className="mx-auto text-3xl text-zinc-400 mb-3" />
        <h3 className="text-base font-semibold text-zinc-900 mb-1">
          No hay artículos que coincidan con la búsqueda
        </h3>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
          Intentá modificando los filtros aplicados o probando con un término de búsqueda diferente.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {products.map(product => (
        <ProductCard key={product.id || product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
