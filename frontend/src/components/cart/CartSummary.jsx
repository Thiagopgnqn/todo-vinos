import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import Button from '../ui/Button';
import { FaWhatsapp, FaShieldAlt, FaWineBottle } from 'react-icons/fa';

const MIN_ORDER_BOTTLES = 6;

const CartSummary = ({ isDrawer = false }) => {
  const { cartCount, cartTotal } = useCart();
  const totalFormatted = Number(cartTotal || 0).toLocaleString('es-AR');
  const remaining = MIN_ORDER_BOTTLES - cartCount;
  const meetsMinimum = remaining <= 0;

  return (
    <div className={`bg-gray-50/80 rounded-2xl border border-gray-200/80 ${isDrawer ? 'p-4' : 'p-6 lg:p-8'} shadow-xs`}>
      <h2 className="text-xl font-playfair font-bold text-gray-900 mb-4">Resumen de Compra</h2>
      
      <div className="flow-root">
        <dl className="-my-3 text-sm divide-y divide-gray-200">
          <div className="py-3 flex items-center justify-between">
            <dt className="text-gray-600">Subtotal ({cartCount} {cartCount === 1 ? 'botella' : 'botellas'})</dt>
            <dd className="font-semibold text-gray-900">${totalFormatted}</dd>
          </div>
          <div className="py-3 flex items-center justify-between">
            <dt className="text-gray-600">Entrega / Envío</dt>
            <dd className="text-xs text-gray-500 font-medium">A coordinar por WhatsApp</dd>
          </div>
          <div className="py-4 flex items-center justify-between">
            <dt className="text-base font-bold text-gray-900">Total Final</dt>
            <dd className="text-2xl font-bold text-wine">${totalFormatted}</dd>
          </div>
        </dl>
      </div>

      {/* Minimum order warning */}
      {!meetsMinimum && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
          <FaWineBottle className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Pedido mínimo: {MIN_ORDER_BOTTLES} botellas
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Agregá {remaining} {remaining === 1 ? 'botella' : 'botellas'} más para poder realizar tu pedido.
            </p>
          </div>
        </div>
      )}

      {meetsMinimum && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <FaShieldAlt className="text-green-500 flex-shrink-0" />
          <p className="text-xs font-medium text-green-700">
            ✓ Cumplís el mínimo de {MIN_ORDER_BOTTLES} botellas
          </p>
        </div>
      )}

      <div className="mt-6">
        {meetsMinimum ? (
          <Link to="/checkout" className="w-full block">
            <Button fullWidth variant="primary" size="lg" className="shadow-md py-3.5 text-base font-semibold">
              Continuar al Checkout
            </Button>
          </Link>
        ) : (
          <div>
            <Button fullWidth variant="primary" size="lg" disabled className="shadow-md py-3.5 text-base font-semibold opacity-50 cursor-not-allowed">
              Continuar al Checkout
            </Button>
            <p className="text-center text-xs text-amber-600 font-medium mt-2">
              Necesitás al menos {MIN_ORDER_BOTTLES} botellas
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center space-y-2 text-xs text-gray-500 text-center">
        <Link to="/catalogo" className="font-medium text-wine hover:underline inline-flex items-center">
          &larr; Seguir explorando el catálogo
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
