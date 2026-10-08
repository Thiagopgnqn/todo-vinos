import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { FiX, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import themeConfig from '../../config/theme';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-overlay flex flex-col h-full border-l border-zinc-200">
          {/* Header del Cajón */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiShoppingBag className="text-zinc-900 text-lg" />
              <h2 className="text-base font-semibold text-zinc-900">Carrito de Compras</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              aria-label="Cerrar carrito"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Cuerpo del Cajón */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            {items.length === 0 ? (
              <div className="text-center py-20 px-4">
                <FiShoppingBag className="mx-auto text-4xl text-zinc-300 mb-3" />
                <h3 className="text-base font-semibold text-zinc-900 mb-1">Tu carrito está vacío</h3>
                <p className="text-zinc-500 text-xs mb-6">No has agregado ningún artículo a tu orden.</p>
                <button 
                  onClick={onClose} 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:underline transition-colors"
                >
                  <span>Explorar el catálogo</span>
                  <FiArrowRight size={12} />
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {items.map(item => (
                  <CartItem key={item.product._id || item.product.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer del Cajón con Resumen */}
          {items.length > 0 && (
            <div className="border-t border-zinc-200 p-5 bg-zinc-50/50">
              <CartSummary isDrawer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
