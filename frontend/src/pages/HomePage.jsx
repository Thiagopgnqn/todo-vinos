import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/catalog/ProductGrid';
import Button from '../components/ui/Button';
import useSEO from '../hooks/useSEO';
import { FaTruck, FaAward, FaUserTie, FaStar, FaQuoteLeft } from 'react-icons/fa';

const reviews = [
  { name: 'Martín G.', location: 'Buenos Aires', rating: 5, text: 'Pedí un Malbec Reserva y llegó impecable, bien empaquetado. La atención por WhatsApp fue súper rápida. Ya hice 3 pedidos más.', date: 'Hace 2 semanas', color: 'bg-wine' },
  { name: 'Carolina S.', location: 'Córdoba', rating: 5, text: 'Increíble la relación precio-calidad. Encontré vinos que en otras vinotecas salen el doble. El envío llegó en perfectas condiciones.', date: 'Hace 1 mes', color: 'bg-amber-700' },
  { name: 'Diego R.', location: 'Rosario', rating: 5, text: 'Compré una caja de 6 botellas para un cumpleaños y fue un éxito total. Me asesoraron con el maridaje y acertaron en todo.', date: 'Hace 3 semanas', color: 'bg-emerald-700' },
  { name: 'Lucía M.', location: 'Mendoza', rating: 5, text: 'Siendo de Mendoza soy exigente con los vinos, y la selección que tienen es excelente. El Cabernet Sauvignon que pedí estaba espectacular.', date: 'Hace 1 semana', color: 'bg-indigo-700' },
  { name: 'Fernando T.', location: 'La Plata', rating: 4, text: 'Muy buena experiencia. El descuento por transferencia es un golazo. Lo único, me gustaría que tengan más espumantes.', date: 'Hace 2 meses', color: 'bg-rose-700' },
  { name: 'Valentina P.', location: 'Tucumán', rating: 5, text: 'Regalé un vino para el día del padre y quedó hermoso. Me ayudaron a elegir uno especial y hasta le pusieron una nota. Divinos.', date: 'Hace 1 mes', color: 'bg-violet-700' },
  { name: 'Alejandro B.', location: 'Mar del Plata', rating: 5, text: 'Ya soy cliente frecuente. Cada vez que necesito un buen vino para una cena, entro acá y siempre encuentro algo nuevo. 100% recomendable.', date: 'Hace 5 días', color: 'bg-teal-700' },
  { name: 'Sofía L.', location: 'Salta', rating: 5, text: 'Pedí un Torrontés salteño que es difícil de conseguir online y lo tenían. Llegó perfecto y frío gracias al packaging. Volveré seguro.', date: 'Hace 3 semanas', color: 'bg-orange-700' },
];

const categories = [
  { name: 'Tintos', type: 'TINTO', bg: 'from-[#3b0910] to-[#722F37]', icon: '🍷' },
  { name: 'Blancos', type: 'BLANCO', bg: 'from-[#bda55d] to-[#e6d8a7]', icon: '🥂' },
  { name: 'Rosados', type: 'ROSADO', bg: 'from-[#b84a62] to-[#d97d8f]', icon: '🌸' },
  { name: 'Espumantes', type: 'ESPUMANTE', bg: 'from-[#8a7b4f] to-[#c2b078]', icon: '✨' },
];

const HomePage = () => {
  const { products, loading, fetchProducts } = useProducts();

  useSEO({
    title: 'Todo Vinos — Vinoteca Online | Selección Exclusiva de Vinos Argentinos',
    description: 'Comprá vinos argentinos online: Malbec, Cabernet, Chardonnay y Espumantes con envíos seguros y precios especiales por transferencia bancaria.',
    keywords: 'vinoteca online, comprar vino argentina, malbec mendoza, todo vinos, vino tinto, bodega, vinos finos',
  });

  useEffect(() => {
    fetchProducts({ limit: 4 });
  }, [fetchProducts]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-wine via-[#3b0910] to-gray-900 opacity-85 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <span className="text-gold tracking-[0.3em] uppercase text-sm font-semibold mb-4 block drop-shadow">
            Cava &amp; Bodega Seleccionada
          </span>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-cream mb-6 drop-shadow-lg leading-tight">
            Descubrí los mejores vinos
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light max-w-2xl mx-auto">
            Una selección curada de las bodegas más exclusivas de Argentina directo a tu mesa.
          </p>
          <Link to="/catalogo">
            <Button size="lg" className="bg-gold text-gray-900 font-semibold border-none hover:bg-opacity-90 shadow-xl px-8 py-4 text-lg hover:scale-105 transition-transform">
              Explorar Catálogo
            </Button>
          </Link>
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="py-20 bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Testimonios</span>
            <h2 className="font-playfair text-4xl text-gray-900 mt-1 mb-4">Lo que dicen nuestros clientes</h2>
            <div className="h-0.5 w-16 bg-gold mx-auto"></div>
            <p className="text-gray-500 text-sm mt-4 max-w-xl mx-auto">
              Más de 500 clientes satisfechos en todo el país nos eligen para disfrutar los mejores vinos argentinos.
            </p>
          </div>
        </div>

        {/* Infinite scroll container */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-scroll-reviews hover:[animation-play-state:paused]">
            {[...reviews, ...reviews].map((review, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[320px] sm:w-[380px] mx-3"
              >
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Quote icon & stars */}
                  <div className="flex items-center justify-between mb-4">
                    <FaQuoteLeft className="text-gold/30 text-2xl" />
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-sm ${i < review.rating ? 'text-gold' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review text */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">
                    "{review.text}"
                  </p>

                  {/* Reviewer info */}
                  <div className="flex items-center mt-5 pt-4 border-t border-gray-100">
                    <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                      {review.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.location} · {review.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">Selección especial</span>
          <h2 className="font-playfair text-4xl text-gray-900 mt-1 mb-4">Vinos Destacados</h2>
          <div className="h-0.5 w-16 bg-gold mx-auto"></div>
        </div>
        <ProductGrid products={products.slice(0, 4)} loading={loading} />
        <div className="mt-12 text-center">
          <Link to="/catalogo">
            <Button variant="secondary" size="lg">Ver todos los vinos ({products.length > 0 ? '+ más' : ''})</Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Variedades</span>
            <h2 className="font-playfair text-4xl text-gray-900 mt-1 mb-4">Nuestras Categorías</h2>
            <div className="h-0.5 w-16 bg-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.type} 
                to={`/catalogo?type=${cat.type}`} 
                className="group relative h-64 overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} transition-all duration-300 group-hover:scale-105`}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-4 text-center">
                  <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <h3 className="font-playfair text-2xl font-bold drop-shadow-md">{cat.name}</h3>
                  <span className="text-xs uppercase tracking-widest text-white/80 mt-2 border border-white/30 rounded-full px-3 py-1 group-hover:bg-white group-hover:text-gray-900 transition-colors">
                    Ver colección
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#1a1a1a] text-cream">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-center mb-4 text-gold"><FaAward size={40} /></div>
            <h3 className="font-playfair text-2xl font-bold mb-3 text-white">Selección Curada</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Elegimos cada botella con dedicación, asegurando la mejor calidad y procedencia directa de bodega.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-center mb-4 text-gold"><FaTruck size={40} /></div>
            <h3 className="font-playfair text-2xl font-bold mb-3 text-white">Envío a Domicilio</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Recibí tu pedido en la puerta de tu casa. Envíos seguros y empaquetado especial para botellas.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-center mb-4 text-gold"><FaUserTie size={40} /></div>
            <h3 className="font-playfair text-2xl font-bold mb-3 text-white">Atención Personalizada</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Coordinamos cada detalle directo por WhatsApp para asesorarte con el maridaje y los pagos.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
