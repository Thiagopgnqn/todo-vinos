import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  FaChartBar, 
  FaWineBottle, 
  FaClipboardList, 
  FaStore, 
  FaSignOutAlt, 
  FaArrowLeft,
  FaTimes
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', to: '/admin', icon: FaChartBar, end: true },
    { name: 'Productos', to: '/admin/productos', icon: FaWineBottle },
    { name: 'Pedidos', to: '/admin/pedidos', icon: FaClipboardList },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] text-cream border-r border-gray-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top brand */}
        <div>
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-2" onClick={onClose}>
              <span className="text-2xl">🍷</span>
              <div>
                <h2 className="text-lg font-playfair font-bold text-gold leading-tight">TODO VINOS</h2>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-sans">Panel de Control</span>
              </div>
            </Link>
            {/* Mobile close button */}
            <button 
              onClick={onClose}
              className="md:hidden text-gray-400 hover:text-white p-1"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Quick link to store */}
          <div className="p-4">
            <Link 
              to="/" 
              onClick={onClose}
              className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-lg bg-wine/20 text-cream border border-wine/40 hover:bg-wine hover:text-white transition-all text-sm font-medium group"
            >
              <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
              <span>Volver a la Tienda</span>
            </Link>
          </div>

          {/* Admin Navigation */}
          <div className="px-4 py-2">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Administración</p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-wine text-white shadow-sm' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Public store links */}
          <div className="px-4 py-4 border-t border-gray-800/80 mt-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Accesos Directos</p>
            <nav className="space-y-1">
              <Link
                to="/catalogo"
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-cream transition-colors"
              >
                <FaStore className="h-4 w-4" />
                <span>Ver Catálogo</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* User footer */}
        <div className="p-4 border-t border-gray-800 bg-[#141414]">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrador'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
            <span className="text-[10px] bg-wine/80 text-white px-2 py-0.5 rounded font-bold">ADMIN</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
