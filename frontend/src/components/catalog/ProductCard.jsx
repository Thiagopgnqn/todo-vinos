import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import useCart from '../../hooks/useCart';

const wineTypeGradients = {
  TINTO: 'from-[#4a0e17] to-[#722F37]',
  BLANCO: 'from-[#bda55d] to-[#e6d8a7]',
  ROSADO: 'from-[#b84a62] to-[#d97d8f]',
  ESPUMANTE: 'from-[#8a7b4f] to-[#c2b078]',
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const isOutOfStock = product.stock === 0;
  const productId = product.id || product._id;
  const imageUrl = product.imageUrl || product.image;
  const priceFormatted = Number(product.price).toLocaleString('es-AR');
  const typeKey = (product.type || 'TINTO').toUpperCase();
  const bgGradient = wineTypeGradients[typeKey] || 'from-gray-700 to-gray-900';

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <Link to={`/producto/${productId}`} className="relative flex-grow flex flex-col">
        <div className="aspect-[3/4] w-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {imageUrl && !imgError ? (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-b ${bgGradient} flex flex-col items-center justify-center p-6 text-center text-white`}>
              <span className="text-4xl mb-2">🍷</span>
              <span className="font-playfair font-bold text-lg leading-tight drop-shadow">{product.name}</span>
              <span className="text-xs uppercase tracking-widest mt-1 opacity-80">{product.winery}</span>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <Badge variant={typeKey.toLowerCase()}>{product.type}</Badge>
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 font-bold rounded text-xs uppercase tracking-wider shadow">Agotado</span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="text-xs font-semibold text-gold tracking-wider uppercase mb-1">{product.winery}</div>
          <h3 className="font-playfair font-bold text-lg text-gray-900 mb-1 leading-tight line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-3">{product.varietal} {product.year ? `• ${product.year}` : ''}</p>
          
          <div className="mt-auto flex items-baseline justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-400 font-normal mr-1">$</span>
              <span className="text-xl font-bold text-wine">{priceFormatted}</span>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">¡Últimas {product.stock}!</span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <Button 
          fullWidth 
          variant="primary" 
          disabled={isOutOfStock}
          onClick={handleAdd}
          className="shadow-xs"
        >
          {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
