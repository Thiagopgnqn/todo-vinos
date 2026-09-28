import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaUser, 
  FaBars, 
  FaTimes, 
  FaStore, 
  FaHome, 
  FaSignInAlt, 
  FaUserPlus, 
  FaUserShield, 
  FaSignOutAlt,
  FaWineGlassAlt
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#1a1a1a] text-cream shadow-md border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            <button 
              className="md:hidden p-2 -ml-2 text-cream hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">🍷</span>
              <span className="font-playfair text-2xl font-bold tracking-wider text-gold group-hover:text-cream transition-colors">
                TODO VINOS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-cream hover:text-gold transition-colors">
              Inicio
            </Link>
            <Link to="/catalogo" className="text-sm font-medium text-cream hover:text-gold transition-colors">
              Catálogo
            </Link>
            <Link to="/catalogo?type=TINTO" className="text-sm text-gray-300 hover:text-gold transition-colors">
              Tintos
            </Link>
            <Link to="/catalogo?type=BLANCO" className="text-sm text-gray-300 hover:text-gold transition-colors">
              Blancos
            </Link>
          </nav>

          {/* Right Actions: Cart & User */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link 
              to="/carrito" 
              className="relative p-2 text-cream hover:text-gold transition-colors flex items-center"
              aria-label="Carrito de compras"
            >
              <FaShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-wine rounded-full shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop User Menu */}
            <div className="hidden md:block relative">
              {user ? (
                <div>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)} 
                    className="flex items-center space-x-2 text-cream hover:text-gold focus:outline-none px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800/60"
                  >
                    <span className="font-medium text-sm max-w-[120px] truncate">{user.name}</span>
                    <FaUser className="h-4 w-4 text-gold" />
                  </button>
                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-xl shadow-xl py-2 bg-white text-gray-800 ring-1 ring-black/5 z-50 divide-y divide-gray-100">
                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-400">Conectado como</p>
                        <p className="text-sm font-bold truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            onClick={() => setUserMenuOpen(false)} 
                            className="flex items-center px-4 py-2 text-sm text-wine font-semibold hover:bg-wine/10 transition-colors"
                          >
                            <FaUserShield className="mr-2" /> Panel Admin
                          </Link>
                        )}
                        <Link 
                          to="/catalogo" 
                          onClick={() => setUserMenuOpen(false)} 
                          className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        >
                          <FaWineGlassAlt className="mr-2 text-gray-400" /> Catálogo
                        </Link>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={() => { logout(); setUserMenuOpen(false); }} 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FaSignOutAlt className="mr-2" /> Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-cream hover:text-gold text-sm font-medium transition-colors">
                    Ingresar
                  </Link>
                  <Link 
                    to="/registro" 
                    className="bg-wine text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-wine/90 transition-colors shadow-xs"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#1a1a1a] text-cream flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-2xl">🍷</span>
                  <span className="font-playfair text-xl font-bold text-gold">TODO VINOS</span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-cream p-2 rounded-lg"
                  aria-label="Cerrar menú"
                >
                  <FaTimes size={22} />
                </button>
              </div>

              {/* Navigation links */}
              <div className="py-6 space-y-2">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">Navegación</p>
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-cream hover:bg-gray-800 hover:text-gold transition-colors"
                >
                  <FaHome className="text-gold" />
                  <span>Inicio</span>
                </Link>
                <Link 
                  to="/catalogo" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-cream hover:bg-gray-800 hover:text-gold transition-colors"
                >
                  <FaStore className="text-gold" />
                  <span>Catálogo Completo</span>
                </Link>

                {/* Subcategories */}
                <div className="pl-9 space-y-1 pt-1">
                  <Link 
                    to="/catalogo?type=TINTO" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-gray-400 hover:text-cream"
                  >
                    🍷 Vinos Tintos
                  </Link>
                  <Link 
                    to="/catalogo?type=BLANCO" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-gray-400 hover:text-cream"
                  >
                    🥂 Vinos Blancos
                  </Link>
                  <Link 
                    to="/catalogo?type=ROSADO" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-gray-400 hover:text-cream"
                  >
                    🌸 Vinos Rosados
                  </Link>
                  <Link 
                    to="/catalogo?type=ESPUMANTE" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-gray-400 hover:text-cream"
                  >
                    ✨ Espumantes
                  </Link>
                </div>

                <Link 
                  to="/carrito" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium text-cream hover:bg-gray-800 hover:text-gold transition-colors mt-2"
                >
                  <div className="flex items-center space-x-3">
                    <FaShoppingCart className="text-gold" />
                    <span>Mi Carrito</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-wine text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Admin shortcut if logged in as admin */}
              {user && isAdmin && (
                <div className="p-3 bg-wine/20 border border-wine/40 rounded-xl mb-4">
                  <p className="text-[11px] font-bold text-gold uppercase tracking-wider mb-1">Acceso de Administrador</p>
                  <Link 
                    to="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-sm font-semibold text-white hover:underline"
                  >
                    <FaUserShield />
                    <span>Ir al Panel de Control</span>
                  </Link>
                </div>
              )}
            </div>

            {/* User Account footer in mobile drawer */}
            <div className="border-t border-gray-800 pt-6">
              {user ? (
                <div className="space-y-3">
                  <div className="px-3">
                    <p className="text-xs text-gray-400">Sesión iniciada como</p>
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg border border-gray-700 text-center text-sm font-medium text-cream hover:bg-gray-800"
                  >
                    <FaSignInAlt className="text-xs" />
                    <span>Ingresar</span>
                  </Link>
                  <Link 
                    to="/registro" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg bg-wine text-center text-sm font-semibold text-white hover:bg-wine/90"
                  >
                    <FaUserPlus className="text-xs" />
                    <span>Registro</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
