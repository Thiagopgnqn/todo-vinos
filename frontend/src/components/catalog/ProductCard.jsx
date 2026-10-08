import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import useCart from '../../hooks/useCart';
import { FiShoppingBag } from 'react-icons/fi';
import themeConfig from '../../config/theme';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const isOutOfStock = product.stock === 0;
  const productId = product.id || product._id;
  const imageUrl = product.imageUrl || product.image;
  const priceFormatted = Number(product.price).toLocaleString('es-AR');

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-zinc-200 overflow-hidden transition-smooth hover:border-zinc-400 flex flex-col h-full relative">
      <Link to={`/producto/${productId}`} className="relative flex-grow flex flex-col">
        {/* Contenedor de Imagen con proporción fija 1:1 */}
        <div className="aspect-square w-full bg-zinc-100 relative overflow-hidden flex items-center justify-center border-b border-zinc-100">
          {imageUrl && !imgError ? (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out" 
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center p-6 text-center text-zinc-400">
              <FiShoppingBag className="text-3xl mb-2 text-zinc-300" />
              <span className="text-xs font-medium text-zinc-500 line-clamp-1">
                {product.name}
              </span>
            </div>
          )}

          {/* Badge de tipo/categoría */}
          {product.type && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <Badge variant="neutral">{product.type}</Badge>
            </div>
          )}

          {/* Estado de sin stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-20">
              <span className="bg-zinc-900 text-white px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider">
                Sin Stock
              </span>
            </div>
          )}
        </div>

        {/* Ficha descriptiva */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          {/* Subtítulo / Marca o Categoría */}
          {product.winery && (
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1 truncate">
              {product.winery}
            </div>
          )}
          
          <h3 className="font-medium text-sm sm:text-base text-zinc-900 mb-1 leading-snug line-clamp-2">
            {product.name}
          </h3>

          {(product.varietal || product.year) && (
            <p className="text-xs text-zinc-500 font-normal mb-3 flex items-center gap-1.5">
              <span>{product.varietal}</span>
              {product.year && (
                <>
                  <span className="text-zinc-300">•</span>
                  <span>{product.year}</span>
                </>
              )}
            </p>
          )}
          
          {/* Precios */}
          <div className="mt-auto pt-3 border-t border-zinc-100">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">
                  {themeConfig.brand.currencySymbol}{priceFormatted}
                </span>
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Últimas {product.stock} un.
                </span>
              )}
            </div>

            {product.transferPrice && (
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                <span>{themeConfig.brand.currencySymbol}{Number(product.transferPrice).toLocaleString('es-AR')}</span>
                <span className="text-zinc-400 font-normal ml-1">(con transferencia)</span>
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Botón de acción rápida */}
      <div className="p-4 sm:p-5 pt-0">
        <Button 
          fullWidth 
          variant={isOutOfStock ? 'secondary' : 'primary'} 
          disabled={isOutOfStock}
          onClick={handleAdd}
          className="py-2 text-xs font-medium"
        >
          {isOutOfStock ? (
            'Agotado'
          ) : (
            <span className="inline-flex items-center gap-2">
              <FiShoppingBag className="text-xs" />
              <span>Agregar al carrito</span>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
