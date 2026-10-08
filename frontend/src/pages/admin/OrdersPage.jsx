import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import OrderTable from '../../components/admin/OrderTable';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { FiCheckCircle, FiClock, FiTruck, FiXCircle } from 'react-icons/fi';
import themeConfig from '../../config/theme';

const statusTabs = [
  { id: 'ALL', label: 'Todos' },
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'CONFIRMED', label: 'Confirmados' },
  { id: 'DELIVERED', label: 'Entregados' },
  { id: 'CANCELLED', label: 'Cancelados' },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await client.get('/orders');
      setOrders(res.data.orders || res.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => (o.status || '').toUpperCase() === filter);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await client.patch(`/orders/${id}/status`, { status: newStatus });
      await fetchOrders();
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      alert(error.response?.data?.error || 'Error al actualizar el estado del pedido');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-zinc-200">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Operaciones &bull; Ventas</span>
          <h1 className="text-2xl font-semibold text-zinc-900 mt-0.5">Gestión de Pedidos</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Control y actualización del estado de las órdenes recibidas</p>
        </div>
      </div>
      
      {/* Status tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-lg overflow-x-auto border border-zinc-200">
        {statusTabs.map(tab => {
          const isActive = filter === tab.id;
          const count = tab.id === 'ALL' ? orders.length : orders.filter(o => (o.status || '').toUpperCase() === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-normal whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-white text-zinc-900 shadow-soft font-semibold' 
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-2 text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isActive ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'bg-zinc-200/70 text-zinc-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <OrderTable orders={filteredOrders} onViewDetails={setSelectedOrder} />

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Detalle del Pedido">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-100 gap-3">
              <div>
                <p className="text-xs text-zinc-400 font-mono">
                  N° {selectedOrder.id || selectedOrder._id}
                </p>
                <p className="text-xs text-zinc-600 font-medium mt-0.5">
                  Fecha: {new Date(selectedOrder.createdAt).toLocaleString('es-AR')}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Cambiar estado:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: 'PENDING', label: 'Pendiente', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                    { value: 'CONFIRMED', label: 'Confirmado', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                    { value: 'DELIVERED', label: 'Entregado', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                    { value: 'CANCELLED', label: 'Cancelado', color: 'bg-rose-50 text-rose-800 border-rose-200' },
                  ].map(s => {
                    const isActive = (selectedOrder.status || 'PENDING').toUpperCase() === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => !isActive && handleStatusChange(selectedOrder.id || selectedOrder._id, s.value)}
                        className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                          isActive 
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-soft cursor-default font-semibold' 
                            : `${s.color} hover:opacity-80 cursor-pointer`
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-md border border-zinc-200">
                <h4 className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider mb-2">Datos del Cliente</h4>
                <p className="text-xs sm:text-sm font-semibold text-zinc-900">{selectedOrder.customerName || selectedOrder.name}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{selectedOrder.customerEmail || selectedOrder.email}</p>
                <p className="text-xs text-zinc-600 mt-0.5 font-mono">{selectedOrder.customerPhone || selectedOrder.phone}</p>
              </div>

              <div className="bg-zinc-50 p-4 rounded-md border border-zinc-200">
                <h4 className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider mb-2">Dirección de Entrega</h4>
                <p className="text-xs sm:text-sm text-zinc-900">{selectedOrder.customerAddress || 'No especificada'}</p>
                {selectedOrder.comments && (
                  <p className="text-xs text-zinc-500 italic mt-2 border-t border-zinc-200 pt-1">
                    Nota: "{selectedOrder.comments}"
                  </p>
                )}
              </div>
            </div>

            {/* Artículos del pedido */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">Artículos del Pedido</h4>
              <div className="border border-zinc-200 rounded-md overflow-hidden divide-y divide-zinc-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-zinc-900">{item.product?.name || item.name || 'Producto'}</span>
                      <span className="text-zinc-400 ml-2">x {item.quantity} un.</span>
                    </div>
                    <span className="font-medium text-zinc-900">
                      {themeConfig.brand.currencySymbol}{(Number(item.price || item.product?.price || 0) * item.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 flex justify-between items-center text-sm font-semibold text-zinc-900">
              <span>Total de la Orden</span>
              <span className="text-base font-bold">
                {themeConfig.brand.currencySymbol}{Number(selectedOrder.total || 0).toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
