import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 bg-white shadow-xl flex flex-col h-full">
          <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-playfair font-medium text-gray-900">Mi Carrito</h2>
              <button onClick={onClose} className="ml-3 h-7 flex items-center text-gray-400 hover:text-gray-500">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="mt-8">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
                  <button onClick={onClose} className="text-wine font-medium hover:underline">Ir al catálogo</button>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {items.map(item => (
                      <li key={item.product._id || item.product.id}>
                        <CartItem item={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <CartSummary isDrawer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
