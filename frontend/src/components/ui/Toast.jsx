import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimes, FaShoppingCart, FaWineBottle } from 'react-icons/fa';

const Toast = ({ show, message, product, onClose, duration = 3500 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => setVisible(true));
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const formattedPrice = product?.price ? Number(product.price).toLocaleString('es-AR') : null;
  const imageUrl = product?.imageUrl || product?.image;

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] pointer-events-auto max-w-[calc(100vw-2rem)] w-[400px]">
      <div
        className={`bg-white rounded-2xl shadow-2xl border-2 border-green-500/30 overflow-hidden transform transition-all duration-300 ease-out ${
          visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'
        }`}
      >
        {/* Header con éxito */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className="bg-white/20 p-1.5 rounded-full">
              <FaCheckCircle className="text-white text-lg" />
            </div>
            <span className="font-bold text-sm tracking-wide">
              ¡Agregado al Carrito con Éxito!
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Contenido del producto */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center space-x-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product?.name || 'Vino'}
                className="w-16 h-20 object-cover rounded-xl border border-gray-100 shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-20 bg-gradient-to-b from-wine to-[#4a0e17] rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                <FaWineBottle className="text-2xl opacity-90" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {product?.winery && (
                <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold truncate mb-0.5">
                  {product.winery}
                </p>
              )}
              <h4 className="font-playfair font-bold text-gray-900 text-base leading-snug line-clamp-2">
                {product?.name || message || 'Producto'}
              </h4>
              {formattedPrice && (
                <p className="text-wine font-bold text-base mt-1">
                  <span className="text-xs text-gray-400 font-normal mr-1">$</span>
                  {formattedPrice}
                </p>
              )}
            </div>
          </div>

          {/* Botones de acción rápida */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2.5">
            <a
              href="/carrito"
              className="flex-1 inline-flex items-center justify-center space-x-2 bg-wine hover:bg-wine/90 active:scale-98 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md"
            >
              <FaShoppingCart size={14} />
              <span>Ver Carrito</span>
            </a>
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Seguir viendo
            </button>
          </div>
        </div>

        {/* Barra de progreso de auto-cierre */}
        <div className="h-1 bg-gray-100 w-full overflow-hidden">
          <div
            className={`h-full bg-emerald-500 transition-all ease-linear ${
              visible ? 'w-0' : 'w-full'
            }`}
            style={{ transitionDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;

