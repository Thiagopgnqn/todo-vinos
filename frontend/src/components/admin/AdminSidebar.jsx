import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  FiBarChart2, 
  FiBox, 
  FiShoppingBag, 
  FiUsers, 
  FiTag, 
  FiLogOut, 
  FiArrowLeft,
  FiX 
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import themeConfig from '../../config/theme';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', to: '/admin', icon: FiBarChart2, end: true },
    { name: 'Inventario de Productos', to: '/admin/productos', icon: FiBox },
    { name: 'Categorías & Tipos', to: '/admin/tipos', icon: FiTag },
    { name: 'Pedidos de Clientes', to: '/admin/pedidos', icon: FiShoppingBag },
    { name: 'Usuarios & Cuentas', to: '/admin/usuarios', icon: FiUsers },
  ];

  return (
    <>
      {/* Backdrop en móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose} 
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-zinc-300 border-r border-zinc-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand superior */}
        <div>
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-2" onClick={onClose}>
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">{themeConfig.brand.name}</h2>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Panel de Control</span>
              </div>
            </Link>
            <button 
              onClick={onClose}
              className="md:hidden text-zinc-400 hover:text-white p-1 rounded"
              aria-label="Cerrar barra lateral"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Enlace rápido para ver la tienda */}
          <div className="p-4">
            <Link 
              to="/" 
              onClick={onClose}
              className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors text-xs font-medium"
            >
              <FiArrowLeft size={12} />
              <span>Ver Tienda Online</span>
            </Link>
          </div>

          {/* Menú de administración */}
          <div className="px-3 py-2">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-3 mb-2">Administración</p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4 text-zinc-400" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer con información de sesión */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrador'}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
            <span className="text-[9px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">ADMIN</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-md text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <FiLogOut size={13} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
