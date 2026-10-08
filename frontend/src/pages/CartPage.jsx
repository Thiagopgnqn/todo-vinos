import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/ui/Button';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import themeConfig from '../config/theme';

const CartPage = () => {
  const { items } = useCart();

  return (
    <div className="bg-white min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8 pb-4 border-b border-zinc-200">
          <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
            Orden Actual
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mt-1">
            Carrito de Compras
          </h1>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-20 px-4 bg-zinc-50 rounded-lg border border-zinc-200 max-w-lg mx-auto">
            <FiShoppingBag className="mx-auto text-4xl text-zinc-300 mb-3" />
            <h2 className="text-lg font-semibold text-zinc-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-zinc-500 text-xs sm:text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Explorá nuestra selección de vinos y bodegas para armar tu caja de pedido.
            </p>
            <Link to="/catalogo">
              <Button variant="primary" size="lg" className="px-6 text-xs sm:text-sm">
                <span>Explorar Cava</span>
                <FiArrowRight className="ml-2 text-xs" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-10 lg:items-start">
            {/* Lista de productos */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-lg border border-zinc-200">
              <div className="divide-y divide-zinc-100">
                {items.map((item) => (
                  <CartItem key={item.product._id || item.product.id} item={item} />
                ))}
              </div>
            </div>

            {/* Resumen de compra */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
