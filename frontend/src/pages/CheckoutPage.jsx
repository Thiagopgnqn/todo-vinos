import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { FiLock, FiShoppingBag } from 'react-icons/fi';
import themeConfig from '../config/theme';

const CheckoutPage = () => {
  const { items, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const minUnits = themeConfig.brand.minOrderUnits || 6;

  useEffect(() => {
    if (items.length === 0 || cartCount < minUnits) {
      navigate('/carrito');
    }
  }, [items, cartCount, minUnits, navigate]);

  if (items.length === 0 || cartCount < minUnits) return null;

  return (
    <div className="bg-zinc-50/60 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner de seguridad */}
        <div className="flex items-center justify-center gap-2 mb-8 text-zinc-500">
          <FiLock className="text-zinc-700 text-xs" />
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-700">
            Checkout Protegido &bull; Compra Directa
          </span>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-10 lg:items-start">
          {/* Formulario de Checkout */}
          <div className="lg:col-span-7">
            <CheckoutForm />
          </div>

          {/* Resumen de la Orden */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg p-6 sm:p-7 border border-zinc-200 sticky top-24">
              <div className="pb-3 mb-4 border-b border-zinc-100">
                <h2 className="text-base font-semibold text-zinc-900">Tu Pedido</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {cartCount} {cartCount === 1 ? themeConfig.brand.unitName : themeConfig.brand.unitNamePlural} seleccionadas
                </p>
              </div>

              <ul className="divide-y divide-zinc-100 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.product._id || item.product.id} className="py-3 flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 bg-zinc-100 rounded border border-zinc-200 overflow-hidden flex items-center justify-center">
                      {(item.product.imageUrl || item.product.image) ? (
                        <img src={item.product.imageUrl || item.product.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <FiShoppingBag className="text-zinc-400 text-base" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium text-zinc-900 truncate">{item.product.name}</h3>
                      <p className="text-[11px] text-zinc-400">Cant: {item.quantity} un.</p>
                    </div>
                    <p className="text-xs font-semibold text-zinc-900">
                      {themeConfig.brand.currencySymbol}{(Number(item.product.price) * item.quantity).toLocaleString('es-AR')}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 border-t border-zinc-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <dt>Subtotal botellas</dt>
                  <dd className="font-semibold text-zinc-900">{themeConfig.brand.currencySymbol}{cartTotal.toLocaleString('es-AR')}</dd>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <dt>Costo de envío</dt>
                  <dd className="text-zinc-600 font-medium">A coordinar por WhatsApp</dd>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold text-zinc-900 pt-3 border-t border-zinc-200">
                  <dt>Total Final</dt>
                  <dd className="text-lg font-bold text-zinc-900 tracking-tight">{themeConfig.brand.currencySymbol}{cartTotal.toLocaleString('es-AR')}</dd>
                </div>
              </dl>

              <div className="mt-5 p-3 rounded bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-500 leading-relaxed font-normal">
                <p>Al confirmar el pedido, te conectaremos directo por WhatsApp para coordinar la entrega y el medio de pago conveniente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
