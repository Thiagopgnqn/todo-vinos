import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/catalog/ProductGrid';
import Button from '../components/ui/Button';
import { FaTruck, FaAward, FaUserTie } from 'react-icons/fa';

const categories = [
  { name: 'Tintos', type: 'TINTO', bg: 'from-[#3b0910] to-[#722F37]', icon: '🍷' },
  { name: 'Blancos', type: 'BLANCO', bg: 'from-[#bda55d] to-[#e6d8a7]', icon: '🥂' },
  { name: 'Rosados', type: 'ROSADO', bg: 'from-[#b84a62] to-[#d97d8f]', icon: '🌸' },
  { name: 'Espumantes', type: 'ESPUMANTE', bg: 'from-[#8a7b4f] to-[#c2b078]', icon: '✨' },
];

const HomePage = () => {
  const { products, loading, fetchProducts } = useProducts();

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
            Cava & Bodega Seleccionada
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
