import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import OrderTable from '../../components/admin/OrderTable';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-playfair">Gestión de Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">Revisá y actualizá el estado de los pedidos recibidos por WhatsApp</p>
        </div>
      </div>
      
      <div className="mb-6 flex space-x-2 border-b border-gray-200 overflow-x-auto">
        {statusTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${filter === tab.id ? 'border-wine text-wine font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {tab.label} {tab.id !== 'ALL' && `(${orders.filter(o => (o.status || '').toUpperCase() === tab.id).length})`}
          </button>
        ))}
      </div>

      <OrderTable orders={filteredOrders} onViewDetails={setSelectedOrder} />

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Detalle del Pedido">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="text-xs text-gray-400 font-mono">ID: {selectedOrder.id || selectedOrder._id}</p>
                <p className="text-sm text-gray-600 font-medium">Fecha: {new Date(selectedOrder.createdAt).toLocaleString('es-AR')}</p>
              </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Estado del pedido:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'PENDING', label: 'Pendiente', colors: 'bg-yellow-100 text-yellow-800 border-yellow-300 ring-yellow-400', activeColors: 'bg-yellow-500 text-white border-yellow-600' },
                  { value: 'CONFIRMED', label: 'Confirmado', colors: 'bg-blue-100 text-blue-800 border-blue-300 ring-blue-400', activeColors: 'bg-blue-500 text-white border-blue-600' },
                  { value: 'DELIVERED', label: 'Entregado', colors: 'bg-green-100 text-green-800 border-green-300 ring-green-400', activeColors: 'bg-green-500 text-white border-green-600' },
                  { value: 'CANCELLED', label: 'Cancelado', colors: 'bg-red-100 text-red-800 border-red-300 ring-red-400', activeColors: 'bg-red-500 text-white border-red-600' },
                ].map(s => {
                  const isActive = (selectedOrder.status || 'PENDING').toUpperCase() === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => !isActive && handleStatusChange(selectedOrder.id || selectedOrder._id, s.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isActive ? `${s.activeColors} shadow-sm cursor-default ring-2 ring-offset-1` : `${s.colors} hover:opacity-80 cursor-pointer`}`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">Cliente</h4>
                <p className="text-sm font-semibold text-gray-900">{selectedOrder.customerName || selectedOrder.name}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customerEmail || selectedOrder.email}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customerPhone || selectedOrder.phone}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">Entrega</h4>
                <p className="text-sm font-semibold text-gray-900">
                  🚚 Envío a domicilio
                </p>
                {selectedOrder.customerAddress && (
                  <p className="text-sm text-gray-600 mt-1">{selectedOrder.customerAddress}</p>
                )}
                {selectedOrder.comments && (
                  <p className="text-xs italic text-gray-500 mt-2 bg-white p-2 rounded border border-gray-100">
                    "{selectedOrder.comments}"
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-3">Productos del Pedido</h4>
              <ul className="divide-y divide-gray-200 text-sm border rounded-lg overflow-hidden">
                {(selectedOrder.items || []).map((item, idx) => {
                  const unitPrice = Number(item.unitPrice || item.price || 0);
                  const subtotal = Number(item.subtotal || unitPrice * item.quantity);
                  return (
                    <li key={idx} className="p-3 flex justify-between items-center bg-white hover:bg-gray-50">
                      <div>
                        <span className="font-semibold text-gray-900">{item.product?.name || 'Vino'}</span>
                        <span className="text-xs text-gray-500 ml-2">({item.quantity} un. x ${unitPrice.toLocaleString('es-AR')})</span>
                      </div>
                      <span className="font-medium text-gray-900">${subtotal.toLocaleString('es-AR')}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="pt-4 flex justify-between items-baseline font-bold text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-2xl font-bold text-wine">${Number(selectedOrder.total || 0).toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
