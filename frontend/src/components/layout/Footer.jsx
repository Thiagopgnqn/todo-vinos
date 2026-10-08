import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiMail, FiCheck, FiArrowRight } from 'react-icons/fi';
import themeConfig from '../../config/theme';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Columna 1: Marca y Propósito */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-semibold text-xl tracking-tight text-white">
                {themeConfig.brand.name}
              </span>
              <p className="text-xs text-zinc-400 mt-1">
                {themeConfig.brand.tagline}
              </p>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal max-w-sm">
              {themeConfig.brand.description}
            </p>
            <div className="flex space-x-3 pt-2">
              <a 
                href="#" 
                className="w-8 h-8 rounded border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors" 
                aria-label="Instagram"
              >
                <FiInstagram size={14} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors" 
                aria-label="Twitter"
              >
                <FiTwitter size={14} />
              </a>
              <a 
                href={`mailto:${themeConfig.contact.email}`} 
                className="w-8 h-8 rounded border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors" 
                aria-label="Email"
              >
                <FiMail size={14} />
              </a>
            </div>
          </div>

          {/* Columna 2: Navegación de Cava */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Cava &amp; Variedades
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link to="/catalogo" className="hover:text-white transition-colors">Catálogo Completo</Link></li>
              <li><Link to="/catalogo?type=TINTO" className="hover:text-white transition-colors">Vinos Tintos</Link></li>
              <li><Link to="/catalogo?type=BLANCO" className="hover:text-white transition-colors">Vinos Blancos</Link></li>
              <li><Link to="/catalogo?type=ROSADO" className="hover:text-white transition-colors">Vinos Rosados</Link></li>
              <li><Link to="/catalogo?type=ESPUMANTE" className="hover:text-white transition-colors">Espumantes</Link></li>
            </ul>
          </div>

          {/* Columna 3: Información y Despacho */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Información &amp; Guarda
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><span>Envíos: Embalaje seguro a todo el país</span></li>
              <li><span>Despacho mínimo: Caja de 6 botellas</span></li>
              <li><span>Pagos: Transferencia y métodos bancarios</span></li>
              <li><span>Atención: {themeConfig.contact.hours}</span></li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Novedades de la Cava
            </h3>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              Recibí avisos de nuevas cosechas, partidas limitadas y precios especiales.
            </p>
            {subscribed ? (
              <div className="flex items-center space-x-2 text-xs text-emerald-400 py-2">
                <FiCheck size={14} />
                <span>Gracias por suscribirte.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-zinc-800 text-white placeholder:text-zinc-500 text-xs px-3 py-2 rounded-l border border-zinc-700 focus:outline-none focus:border-zinc-500"
                  />
                  <button
                    type="submit"
                    className="bg-zinc-100 hover:bg-white text-zinc-900 px-3 py-2 rounded-r text-xs font-medium transition-colors"
                    aria-label="Suscribirme"
                  >
                    <FiArrowRight size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-14 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-3">
          <p>
            {themeConfig.legal.copyright}
          </p>
          <p className="text-center sm:text-right">
            {themeConfig.legal.note}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
