import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-base text-cream border-t-4 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-playfair text-2xl font-bold text-gold block mb-4">TODO VINOS</Link>
            <p className="text-sm text-gray-400 mb-4">La mejor selección de vinos de las bodegas más prestigiosas. Tradición y calidad en cada copa.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-gold"><FaFacebookF size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-gold"><FaTwitter size={20} /></a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gold tracking-wider uppercase mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-cream">Inicio</Link></li>
              <li><Link to="/catalogo" className="text-gray-400 hover:text-cream">Catálogo</Link></li>
              <li><Link to="/carrito" className="text-gray-400 hover:text-cream">Mi Carrito</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gold tracking-wider uppercase mb-4">Ayuda</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-cream">Preguntas Frecuentes</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cream">Envíos y Devoluciones</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cream">Términos y Condiciones</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gold tracking-wider uppercase mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Córdoba, Argentina</li>
              <li>+54 9 2996 28-4585</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p className="mb-2">BEBER CON MODERACIÓN. PROHIBIDA SU VENTA A MENORES DE 18 AÑOS.</p>
          <p>&copy; {new Date().getFullYear()} Todo Vinos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
