import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import useAuth from './hooks/useAuth';
import { FaBars, FaStore, FaSignOutAlt } from 'react-icons/fa';

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
import OrdersPage from './pages/admin/OrdersPage';
import UsersPage from './pages/admin/UsersPage';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/" />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar with responsive drawer */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-8 z-10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title="Abrir menú"
            >
              <FaBars size={20} />
            </button>
            <span className="text-sm font-semibold text-gray-500 hidden sm:inline">
              Todo Vinos &bull; Panel de Administración
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-wine hover:text-white px-3.5 py-2 rounded-lg transition-colors shadow-xs"
            >
              <FaStore />
              <span>Ver Tienda</span>
            </Link>

            <Link
              to="/catalogo"
              className="hidden sm:inline-flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-wine px-3 py-2 transition-colors"
            >
              <span>Catálogo</span>
            </Link>

            <button
              onClick={logout}
              className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Cerrar sesión"
            >
              <FaSignOutAlt size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-gray-50">
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
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
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
            <Route path="/admin/pedidos" element={<ProtectedAdminRoute><OrdersPage /></ProtectedAdminRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedAdminRoute><UsersPage /></ProtectedAdminRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
