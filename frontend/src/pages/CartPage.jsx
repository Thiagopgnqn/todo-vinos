import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const CartPage = () => {
  const { items } = useCart();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-10">Tu Carrito</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="font-playfair text-2xl text-gray-700 mb-4">El carrito está vacío</h2>
            <p className="text-gray-500 mb-8">Parece que aún no agregaste ningún vino.</p>
            <Link to="/catalogo" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-wine hover:bg-opacity-90">
              Explorar el catálogo
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-7">
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {items.map((item) => (
                  <li key={item.product._id || item.product.id}>
                    <CartItem item={item} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5 mt-10 lg:mt-0">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
