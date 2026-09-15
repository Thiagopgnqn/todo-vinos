import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import useCart from '../../hooks/useCart';

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

  return (
    <div className="flex py-6 border-b border-gray-200">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
        {(product.imageUrl || product.image) ? (
          <img 
            src={product.imageUrl || product.image} 
            alt={product.name} 
            className="h-full w-full object-cover object-center"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xl bg-gray-50">🍷</div>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3 className="line-clamp-2">
              <Link to={`/producto/${product._id || product.id}`} className="hover:text-wine transition-colors">
                {product.name}
              </Link>
            </h3>
            <p className="ml-4 font-bold text-wine">${(Number(product.price) * quantity).toLocaleString('es-AR')}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{product.winery}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center border border-gray-300 rounded">
            <button onClick={handleDecrease} className="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
            <span className="px-4 py-1 text-gray-900 font-medium border-l border-r border-gray-300">{quantity}</span>
            <button onClick={handleIncrease} disabled={quantity >= product.stock} className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50">+</button>
          </div>
          <div className="flex">
            <button type="button" onClick={() => removeFromCart(product._id || product.id)} className="font-medium text-red-600 hover:text-red-500 flex items-center">
              <FaTrash className="mr-1" /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
