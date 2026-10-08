import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import OrderTable from '../../components/admin/OrderTable';
import Modal from '../../components/ui/Modal';
import { FiBox, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import themeConfig from '../../config/theme';

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalRevenue: 0, totalUsers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          client.get('/products?limit=100'),
          client.get('/orders?limit=100'),
          client.get('/users').catch(() => ({ data: { users: [] } }))
        ]);
        
        const products = productsRes.data.products || productsRes.data || [];
        const orders = ordersRes.data.orders || ordersRes.data || [];
        const users = usersRes.data.users || [];
        
        const pending = orders.filter(o => (o.status || '').toUpperCase() === 'PENDING');
        const revenue = orders
          .filter(o => (o.status || '').toUpperCase() !== 'CANCELLED')
          .reduce((acc, o) => acc + Number(o.total || 0), 0);

        setStats({
          totalProducts: productsRes.data.total || products.length,
          totalOrders: ordersRes.data.total || orders.length,
          pendingOrders: pending.length,
          totalRevenue: revenue,
          totalUsers: users.length
        });
        
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Artículos en Catálogo', value: stats.totalProducts, icon: FiBox, color: 'bg-zinc-100 text-zinc-800 border-zinc-200', link: '/admin/productos' },
    { title: 'Total Pedidos', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-zinc-100 text-zinc-800 border-zinc-200', link: '/admin/pedidos' },
    { title: 'Usuarios Registrados', value: stats.totalUsers, icon: FiUsers, color: 'bg-zinc-100 text-zinc-800 border-zinc-200', link: '/admin/usuarios' },
    { title: 'Ingresos Estimados', value: `${themeConfig.brand.currencySymbol}${stats.totalRevenue.toLocaleString('es-AR')}`, icon: FiDollarSign, color: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-200">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Resumen General</span>
          <h1 className="text-2xl font-semibold text-zinc-900 mt-0.5">Panel de Control</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Métricas operativas y actividad reciente</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card, idx) => {
          const content = (
            <div className="bg-white rounded-lg border border-zinc-200 p-5 flex items-center hover:border-zinc-300 transition-colors">
              <div className={`p-3 rounded-md border ${card.color} mr-4`}>
                <card.icon size={20} />
              </div>
              <div>
                <p className="text-[11px] text-zinc-400 uppercase font-medium tracking-wider">{card.title}</p>
                <p className="text-xl font-bold text-zinc-900 mt-0.5 tracking-tight">{card.value}</p>
              </div>
            </div>
          );

          return card.link ? (
            <Link key={idx} to={card.link} className="block group">
              {content}
            </Link>
          ) : (
            <div key={idx}>{content}</div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Pedidos Recientes</h2>
            <p className="text-xs text-zinc-500">Últimas órdenes ingresadas</p>
          </div>
          <Link to="/admin/pedidos" className="text-xs text-zinc-900 font-medium hover:underline">
            Ver todos los pedidos &rarr;
          </Link>
        </div>
        <OrderTable orders={recentOrders} onViewDetails={setSelectedOrder} />
      </div>

      {/* Modal para detalle de pedido */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Detalle del Pedido">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <div>
                <p className="text-[11px] text-zinc-400 font-mono">ID: {selectedOrder.id || selectedOrder._id}</p>
                <p className="text-xs text-zinc-600">{new Date(selectedOrder.createdAt).toLocaleString('es-AR')}</p>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                {selectedOrder.status}
              </span>
            </div>
            
            <div className="bg-zinc-50 p-4 rounded-md text-xs space-y-1.5 border border-zinc-200">
              <p><strong className="text-zinc-900">Cliente:</strong> {selectedOrder.customerName || selectedOrder.name}</p>
              <p><strong className="text-zinc-900">Teléfono:</strong> {selectedOrder.customerPhone || selectedOrder.phone}</p>
              <p><strong className="text-zinc-900">Email:</strong> {selectedOrder.customerEmail || selectedOrder.email}</p>
              <p><strong className="text-zinc-900">Entrega:</strong> {selectedOrder.customerAddress || 'Sin dirección'}</p>
            </div>

            <div className="pt-2 flex justify-between font-semibold text-sm border-t border-zinc-100">
              <span className="text-zinc-900">Total</span>
              <span className="text-zinc-900 font-bold">{themeConfig.brand.currencySymbol}{Number(selectedOrder.total || 0).toLocaleString('es-AR')}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
