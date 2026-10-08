import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX, FiShoppingBag } from 'react-icons/fi';
import themeConfig from '../../config/theme';

const Toast = ({ show, message, product, onClose, duration = 3500 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => setVisible(true));
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 200);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const formattedPrice = product?.price ? Number(product.price).toLocaleString('es-AR') : null;
  const imageUrl = product?.imageUrl || product?.image;

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] pointer-events-auto max-w-[calc(100vw-2rem)] w-[380px]">
      <div
        className={`bg-white rounded-lg shadow-lifted border border-zinc-200 overflow-hidden transition-smooth ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
      >
        {/* Header simple y limpio */}
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700">
              <FiCheck size={11} />
            </span>
            <span className="text-xs font-medium text-zinc-900">
              Agregado al carrito
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded transition-colors"
            aria-label="Cerrar notificación"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* Contenido del producto */}
        <div className="p-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 bg-zinc-100 rounded border border-zinc-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product?.name || 'Producto'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiShoppingBag className="text-zinc-400 text-lg" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-zinc-900 text-xs sm:text-sm truncate">
                {product?.name || message || 'Producto'}
              </h4>
              {formattedPrice && (
                <p className="text-xs font-semibold text-zinc-900 mt-0.5">
                  {themeConfig.brand.currencySymbol}{formattedPrice}
                </p>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center gap-2">
            <Link
              to="/carrito"
              onClick={handleClose}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2 px-3 rounded-md text-xs transition-colors"
            >
              <FiShoppingBag size={13} />
              <span>Ver Carrito</span>
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
            >
              Seguir explorando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
