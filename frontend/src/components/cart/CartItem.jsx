import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import useCart from '../../hooks/useCart';
import themeConfig from '../../config/theme';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product._id || product.id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      updateQuantity(product._id || product.id, quantity + 1);
    }
  };

  const unitTotal = (Number(product.price) * quantity).toLocaleString('es-AR');

  return (
    <div className="flex py-5 gap-4 border-b border-zinc-100 items-center">
      {/* Thumbnail de producto */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-100 flex items-center justify-center">
        {(product.imageUrl || product.image) ? (
          <img 
            src={product.imageUrl || product.image} 
            alt={product.name} 
            className="h-full w-full object-cover object-center"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <FiShoppingBag className="text-zinc-400 text-xl" />
        )}
      </div>

      {/* Info y Controles */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div>
              {product.winery && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">
                  {product.winery}
                </p>
              )}
              <h3 className="font-medium text-sm text-zinc-900 line-clamp-1">
                <Link to={`/producto/${product._id || product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </h3>
              {(product.varietal || product.year) && (
                <p className="text-xs text-zinc-400 mt-0.5">
                  {[product.varietal, product.year].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>

            <p className="font-semibold text-zinc-900 text-sm whitespace-nowrap ml-2">
              {themeConfig.brand.currencySymbol}{unitTotal}
            </p>
          </div>
        </div>

        {/* Stepper y botón eliminar */}
        <div className="flex items-center justify-between mt-3">
          <div className="inline-flex items-center border border-zinc-200 rounded bg-white">
            <button 
              onClick={handleDecrease} 
              className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
              title="Disminuir una unidad"
              aria-label="Disminuir una unidad"
            >
              <FiMinus size={11} />
            </button>
            <span className="px-3 text-xs font-medium text-zinc-900 select-none">
              {quantity}
            </span>
            <button 
              onClick={handleIncrease} 
              disabled={quantity >= product.stock} 
              className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-30 transition-colors"
              title="Aumentar una unidad"
              aria-label="Aumentar una unidad"
            >
              <FiPlus size={11} />
            </button>
          </div>

          <button 
            type="button" 
            onClick={() => removeFromCart(product._id || product.id)} 
            className="text-xs text-zinc-400 hover:text-rose-600 flex items-center gap-1 transition-colors p-1"
            title="Quitar del carrito"
          >
            <FiTrash2 size={13} /> 
            <span className="hidden sm:inline">Quitar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
