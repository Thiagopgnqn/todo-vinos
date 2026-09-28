import React from 'react';
import Badge from '../ui/Badge';
import { FaEye, FaCalendarAlt, FaUser, FaChevronRight } from 'react-icons/fa';

const OrderTable = ({ orders, onViewDetails }) => {
  const getStatusVariant = (status) => {
    const s = (status || '').toLowerCase();
    const map = { pending: 'pending', confirmed: 'confirmed', delivered: 'delivered', cancelled: 'cancelled' };
    return map[s] || 'default';
  };

  const getStatusText = (status) => {
    const s = (status || '').toUpperCase();
    const map = { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado' };
    return map[s] || status;
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-500 text-sm">
        No se encontraron pedidos.
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Card List (screens < 768px) */}
      <div className="md:hidden space-y-3">
        {orders.map(order => {
          const orderId = order.id || order._id;
          const customerName = order.customerName || order.name || 'Cliente';
          const totalFormatted = Number(order.total || 0).toLocaleString('es-AR');

          return (
            <div 
              key={orderId} 
              onClick={() => onViewDetails(order)}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-wine/50 active:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <span className="text-xs font-mono font-semibold text-gray-400">
                  #{orderId.substring(0, 8)}
                </span>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center">
                    <FaUser className="mr-1.5 text-xs text-gray-400" />
                    {customerName}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <FaCalendarAlt className="mr-1.5 text-[10px] text-gray-400" />
                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                  </p>
                </div>

                <div className="text-right flex items-center space-x-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-medium">Total</span>
                    <span className="text-base font-bold text-wine">${totalFormatted}</span>
                  </div>
                  <FaChevronRight className="text-gray-300 text-xs" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (screens >= 768px) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-xs border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID / Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => {
              const orderId = order.id || order._id;
              const customerName = order.customerName || order.name || 'Cliente';
              const customerEmail = order.customerEmail || order.email || '';
              const totalFormatted = Number(order.total || 0).toLocaleString('es-AR');

              return (
                <tr key={orderId} className="hover:bg-gray-50/80 cursor-pointer transition-colors" onClick={() => onViewDetails(order)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 truncate w-28 font-mono" title={orderId}>
                      #{orderId.substring(0, 8)}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('es-AR')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customerName}</div>
                    <div className="text-xs text-gray-500">{customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-wine">
                    ${totalFormatted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(order.status)}>{getStatusText(order.status)}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-500 hover:text-wine p-1 transition-colors" onClick={(e) => { e.stopPropagation(); onViewDetails(order); }} title="Ver detalles">
                      <FaEye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
