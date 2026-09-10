import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { FaLock } from 'react-icons/fa';

const CheckoutPage = () => {
  const { items, cartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrito');
    }
  }, [items, navigate]);

  if (items.length === 0) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-8 text-gray-500">
          <FaLock className="mr-2" />
          <span className="text-sm font-medium uppercase tracking-wider">Checkout Seguro</span>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <CheckoutForm />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-playfair font-medium text-gray-900 mb-4">Resumen del pedido</h2>
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.product._id || item.product.id} className="py-4 flex">
                    <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded border border-gray-200">
                      {item.product.image && <img src={item.product.image} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="ml-4 flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                    </div>
                    <p className="ml-4 text-sm font-medium text-gray-900 flex items-center">${(item.product.price * item.quantity).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 border-t border-gray-200 pt-6 space-y-4 text-sm">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <dt>Total a pagar</dt>
                  <dd className="text-wine">${cartTotal.toLocaleString()}</dd>
                </div>
              </dl>
              <div className="mt-6 text-center text-xs text-gray-500">
                <p>Al confirmar tu pedido, te redirigiremos a WhatsApp para coordinar el pago y envío.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
