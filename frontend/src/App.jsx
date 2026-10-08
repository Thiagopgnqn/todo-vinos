import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import useAuth from './hooks/useAuth';
import { FiMenu, FiExternalLink, FiLogOut } from 'react-icons/fi';

import Layout from './components/layout/Layout';
import AdminSidebar from './components/admin/AdminSidebar';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import WineTypesPage from './pages/admin/WineTypesPage';
import OrdersPage from './pages/admin/OrdersPage';
import UsersPage from './pages/admin/UsersPage';
import ScrollToTop from './components/ScrollToTop';
import themeConfig from './config/theme';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/" />;

  return (
    <div className="flex h-screen bg-zinc-100 overflow-hidden text-zinc-900">
      {/* Sidebar with responsive drawer */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Top Header */}
        <header className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-4 sm:px-8 z-10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              title="Abrir menú"
              aria-label="Abrir menú"
            >
              <FiMenu size={18} />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-zinc-900">
                {themeConfig.brand.name}
              </span>
              <span className="text-zinc-300 hidden sm:inline">&bull;</span>
              <span className="text-xs text-zinc-500 hidden sm:inline">
                Panel de Administración
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-50 px-3 py-1.5 rounded-md transition-colors"
            >
              <FiExternalLink size={13} />
              <span>Ver Tienda</span>
            </Link>

            <button
              onClick={logout}
              className="text-zinc-400 hover:text-rose-600 p-2 rounded-md hover:bg-zinc-100 transition-colors"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="catalogo" element={<CatalogPage />} />
              <Route path="producto/:id" element={<ProductPage />} />
              <Route path="carrito" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="registro" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="/admin" element={<ProtectedAdminRoute><DashboardPage /></ProtectedAdminRoute>} />
            <Route path="/admin/productos" element={<ProtectedAdminRoute><ProductsPage /></ProtectedAdminRoute>} />
            <Route path="/admin/tipos" element={<ProtectedAdminRoute><WineTypesPage /></ProtectedAdminRoute>} />
            <Route path="/admin/pedidos" element={<ProtectedAdminRoute><OrdersPage /></ProtectedAdminRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedAdminRoute><UsersPage /></ProtectedAdminRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
