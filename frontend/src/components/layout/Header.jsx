import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiShield, 
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import themeConfig from '../../config/theme';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  // Bloquear scroll del body al abrir menú mobile
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200 text-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <button 
              className="md:hidden p-2 -ml-2 text-zinc-700 hover:text-zinc-900 rounded-md focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="font-semibold text-lg sm:text-xl tracking-tight text-zinc-900 group-hover:opacity-80 transition-opacity">
                {themeConfig.brand.name}
              </span>
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            {themeConfig.navigation.map((item) => {
              const isActive = location.pathname + location.search === item.href ||
                (item.href === '/catalogo' && location.pathname === '/catalogo' && !location.search);
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`font-normal transition-colors hover:text-zinc-900 relative py-1 text-xs tracking-wide uppercase ${
                    isActive ? 'text-zinc-900 font-semibold border-b border-zinc-900' : 'text-zinc-600'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Acciones de la derecha: Búsqueda, Carrito, Usuario */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/catalogo"
              className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
              aria-label="Buscar en catálogo"
              title="Buscar en catálogo"
            >
              <FiSearch className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>

            <Link 
              to="/carrito" 
              className="relative p-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors flex items-center"
              aria-label="Carrito de compras"
              title="Carrito de compras"
            >
              <FiShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {cartCount > 0 && (
                <span className="absolute 1 top-1 right-1 inline-flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-semibold text-white bg-zinc-900 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Menú de Usuario Desktop */}
            <div className="hidden md:block relative">
              {user ? (
                <div>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)} 
                    className="flex items-center space-x-2 text-zinc-700 hover:text-zinc-900 px-2.5 py-1.5 rounded-md border border-zinc-200 text-xs font-medium hover:bg-zinc-50 transition-colors"
                  >
                    <span className="max-w-[100px] truncate">{user.name}</span>
                    <FiChevronDown className="h-3 w-3 text-zinc-500" />
                  </button>
                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-lifted py-1.5 bg-white border border-zinc-200 z-50 divide-y divide-zinc-100">
                      <div className="px-3.5 py-2">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Cuenta activa</p>
                        <p className="text-xs font-medium text-zinc-900 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            onClick={() => setUserMenuOpen(false)} 
                            className="flex items-center px-3.5 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                          >
                            <FiShield className="mr-2 text-zinc-500" /> Panel de Administración
                          </Link>
                        )}
                        <Link 
                          to="/catalogo" 
                          onClick={() => setUserMenuOpen(false)} 
                          className="flex items-center px-3.5 py-2 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                          Explorar Catálogo
                        </Link>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={() => { logout(); setUserMenuOpen(false); }} 
                          className="flex items-center w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                        >
                          <FiLogOut className="mr-2" /> Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 pl-1">
                  <Link 
                    to="/login" 
                    className="text-zinc-700 hover:text-zinc-900 text-xs font-medium px-2.5 py-1.5 rounded transition-colors"
                  >
                    Ingresar
                  </Link>
                  <Link 
                    to="/registro" 
                    className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors shadow-soft"
                  >
                    Crear cuenta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL DESLIZANTE */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)} 
          />

          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white text-zinc-900 flex flex-col justify-between shadow-overlay p-6 overflow-y-auto border-r border-zinc-200">
            <div>
              {/* Header interior */}
              <div className="flex items-center justify-between pb-5 border-b border-zinc-100">
                <Link to="/" className="font-semibold text-lg tracking-tight" onClick={() => setMobileMenuOpen(false)}>
                  {themeConfig.brand.name}
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-md"
                  aria-label="Cerrar menú"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Enlaces de navegación */}
              <div className="py-6 space-y-1">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-2 mb-2">Navegación</p>
                {themeConfig.navigation.map((item) => (
                  <Link 
                    key={item.label}
                    to={item.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-md text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}

                <Link 
                  to="/carrito" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-2.5 py-2 rounded-md text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors mt-3 pt-3 border-t border-zinc-100"
                >
                  <span>Mi Carrito</span>
                  {cartCount > 0 && (
                    <span className="bg-zinc-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Acceso a Admin en mobile si aplica */}
              {user && isAdmin && (
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md mb-4">
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Administración</p>
                  <Link 
                    to="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-xs font-medium text-zinc-900 hover:underline"
                  >
                    <FiShield className="text-zinc-600" />
                    <span>Panel de Control</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Pie de cuenta en mobile */}
            <div className="border-t border-zinc-100 pt-5">
              {user ? (
                <div className="space-y-3">
                  <div className="px-1">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">Usuario</p>
                    <p className="text-xs font-semibold text-zinc-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-md bg-zinc-100 text-rose-700 text-xs font-medium hover:bg-rose-50 transition-colors"
                  >
                    <FiLogOut size={13} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2 px-3 rounded-md border border-zinc-200 text-center text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                  >
                    Ingresar
                  </Link>
                  <Link 
                    to="/registro" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2 px-3 rounded-md bg-zinc-900 text-center text-xs font-medium text-white hover:bg-zinc-800 shadow-soft"
                  >
                    Registrarse
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
