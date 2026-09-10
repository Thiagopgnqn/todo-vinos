import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import Button from '../ui/Button';
import { FaWhatsapp, FaShieldAlt } from 'react-icons/fa';

const CartSummary = ({ isDrawer = false }) => {
  const { cartCount, cartTotal } = useCart();
  const totalFormatted = Number(cartTotal || 0).toLocaleString('es-AR');

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

      <div className="mt-6">
        <Link to="/checkout" className="w-full block">
          <Button fullWidth variant="primary" size="lg" className="shadow-md py-3.5 text-base font-semibold">
            Continuar al Checkout
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex flex-col items-center space-y-2 text-xs text-gray-500 text-center">
        <p className="flex items-center text-gray-400">
          <FaShieldAlt className="mr-1 text-green-600" /> Compra segura y directa con la bodega
        </p>
        <Link to="/catalogo" className="font-medium text-wine hover:underline inline-flex items-center">
          &larr; Seguir explorando el catálogo
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
