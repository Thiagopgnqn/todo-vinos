import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import OrderTable from '../../components/admin/OrderTable';
import Modal from '../../components/ui/Modal';
import { FaWineBottle, FaClipboardList, FaClock, FaDollarSign, FaUsers } from 'react-icons/fa';

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
    { title: 'Vinos en Catálogo', value: stats.totalProducts, icon: FaWineBottle, color: 'bg-purple-100 text-purple-700', link: '/admin/productos' },
    { title: 'Total Pedidos', value: stats.totalOrders, icon: FaClipboardList, color: 'bg-blue-100 text-blue-700', link: '/admin/pedidos' },
    { title: 'Usuarios Registrados', value: stats.totalUsers, icon: FaUsers, color: 'bg-emerald-100 text-emerald-700', link: '/admin/usuarios' },
    { title: 'Ingresos Estimados', value: `$${stats.totalRevenue.toLocaleString('es-AR')}`, icon: FaDollarSign, color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-playfair">Panel de Control</h1>
          <p className="text-sm text-gray-500 mt-1">Resumen general de tu tienda de vinos</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => {
          const content = (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl ${card.color} mr-4`}>
                <card.icon size={26} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 font-playfair">Pedidos Recientes</h2>
          <Link to="/admin/pedidos" className="text-sm text-wine font-semibold hover:underline">
            Ver todos los pedidos &rarr;
          </Link>
        </div>
        <OrderTable orders={recentOrders} onViewDetails={setSelectedOrder} />
      </div>

      {/* Modal for Order Detail in Dashboard */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Detalle del Pedido">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between pb-3 border-b">
              <div>
                <p className="text-xs text-gray-400 font-mono">ID: {selectedOrder.id || selectedOrder._id}</p>
                <p className="text-sm text-gray-600">{new Date(selectedOrder.createdAt).toLocaleString('es-AR')}</p>
              </div>
              <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
                {selectedOrder.status}
              </span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
              <p><strong>Cliente:</strong> {selectedOrder.customerName || selectedOrder.name}</p>
              <p><strong>Teléfono:</strong> {selectedOrder.customerPhone || selectedOrder.phone}</p>
              <p><strong>Email:</strong> {selectedOrder.customerEmail || selectedOrder.email}</p>
              <p><strong>Entrega:</strong> {selectedOrder.deliveryMethod === 'DELIVERY' ? `Envío a: ${selectedOrder.customerAddress}` : 'Retiro en local'}</p>
            </div>

            <div className="pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-wine">${Number(selectedOrder.total || 0).toLocaleString('es-AR')}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
