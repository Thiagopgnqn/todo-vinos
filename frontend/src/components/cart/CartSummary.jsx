import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import Button from '../ui/Button';
import { FiShield, FiArrowRight, FiInfo } from 'react-icons/fi';
import themeConfig from '../../config/theme';

const CartSummary = ({ isDrawer = false }) => {
  const { cartCount, cartTotal } = useCart();
  const totalFormatted = Number(cartTotal || 0).toLocaleString('es-AR');
  const minUnits = themeConfig.brand.minOrderUnits || 6;
  const remaining = minUnits - cartCount;
  const meetsMinimum = remaining <= 0;

  return (
    <div className={`bg-white rounded-lg border border-zinc-200 ${isDrawer ? 'p-5' : 'p-6 lg:p-7'}`}>
      <div className="pb-3 mb-4 border-b border-zinc-100">
        <h2 className="text-base font-semibold text-zinc-900">Resumen del Pedido</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Valores finales sin costos ocultos</p>
      </div>
      
      <div className="flow-root">
        <dl className="text-xs divide-y divide-zinc-100">
          <div className="py-2.5 flex items-center justify-between">
            <dt className="text-zinc-600">Subtotal ({cartCount} {cartCount === 1 ? themeConfig.brand.unitName : themeConfig.brand.unitNamePlural})</dt>
            <dd className="font-semibold text-zinc-900">{themeConfig.brand.currencySymbol}{totalFormatted}</dd>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <dt className="text-zinc-600">Entrega y logística</dt>
            <dd className="text-zinc-600 font-medium">A coordinar por WhatsApp</dd>
          </div>
          <div className="py-3.5 flex items-center justify-between border-t border-zinc-200">
            <dt className="text-sm font-semibold text-zinc-900">Total Estimado</dt>
            <dd className="text-xl font-bold text-zinc-900 tracking-tight">{themeConfig.brand.currencySymbol}{totalFormatted}</dd>
          </div>
        </dl>
      </div>

      {/* Regla de pedido mínimo para despacho */}
      {!meetsMinimum && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2.5">
          <FiInfo className="text-amber-700 mt-0.5 flex-shrink-0 text-sm" />
          <div>
            <p className="text-xs font-semibold text-amber-800">
              Mínimo para despacho: {minUnits} {themeConfig.brand.unitNamePlural}
            </p>
            <p className="text-[11px] text-amber-700 font-normal mt-0.5 leading-relaxed">
              Faltan <strong className="font-semibold">{remaining} {remaining === 1 ? themeConfig.brand.unitName : themeConfig.brand.unitNamePlural}</strong> para alcanzar el mínimo reglamentario de orden.
            </p>
          </div>
        </div>
      )}

      {meetsMinimum && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded p-3 flex items-center gap-2 text-emerald-800">
          <FiShield className="text-emerald-700 flex-shrink-0 text-sm" />
          <p className="text-xs font-medium">
            Cumplís con el mínimo requerido de {minUnits} {themeConfig.brand.unitNamePlural}
          </p>
        </div>
      )}

      {/* Botón de acción */}
      <div className="mt-6">
        {meetsMinimum ? (
          <Link to="/checkout" className="w-full block">
            <Button fullWidth variant="primary" size="lg" className="text-xs sm:text-sm py-3">
              <span>Continuar al Checkout</span>
              <FiArrowRight className="ml-2 text-xs" />
            </Button>
          </Link>
        ) : (
          <div>
            <Button fullWidth variant="primary" size="lg" disabled className="text-xs sm:text-sm py-3 opacity-40 cursor-not-allowed">
              Continuar al Checkout
            </Button>
            <p className="text-center text-[11px] text-zinc-400 mt-2">
              Sumá artículos para habilitar el pedido
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <Link to="/catalogo" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
          &larr; Continuar explorando catálogo
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
