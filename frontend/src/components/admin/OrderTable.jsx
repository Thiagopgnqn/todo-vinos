import React from 'react';
import Badge from '../ui/Badge';
import { FiEye, FiCalendar, FiUser, FiChevronRight } from 'react-icons/fi';

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
      <div className="p-8 text-center bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-500 text-xs">
        No se encontraron pedidos registrados.
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
              className="bg-white p-4 rounded-lg border border-zinc-200 shadow-soft hover:border-zinc-400 active:bg-zinc-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 mb-2">
                <span className="text-[11px] font-mono font-semibold text-zinc-500">
                  #{orderId.substring(0, 8)}
                </span>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 flex items-center">
                    <FiUser className="mr-1.5 text-xs text-zinc-400" />
                    {customerName}
                  </h4>
                  <p className="text-[11px] text-zinc-400 flex items-center mt-1">
                    <FiCalendar className="mr-1.5 text-[11px] text-zinc-400" />
                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                  </p>
                </div>

                <div className="text-right flex items-center space-x-2">
                  <div>
                    <span className="text-[9px] text-zinc-400 block uppercase font-medium">Total</span>
                    <span className="text-sm font-bold text-zinc-900">${totalFormatted}</span>
                  </div>
                  <FiChevronRight className="text-zinc-300 text-xs" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (screens >= 768px) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">ID / Fecha</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Cliente</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Estado</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-100">
            {orders.map(order => {
              const orderId = order.id || order._id;
              const customerName = order.customerName || order.name || 'Cliente';
              const customerEmail = order.customerEmail || order.email || '';
              const totalFormatted = Number(order.total || 0).toLocaleString('es-AR');

              return (
                <tr key={orderId} className="hover:bg-zinc-50/60 cursor-pointer transition-colors" onClick={() => onViewDetails(order)}>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="text-xs font-semibold text-zinc-900 truncate w-28 font-mono" title={orderId}>
                      #{orderId.substring(0, 8)}
                    </div>
                    <div className="text-[11px] text-zinc-400">{new Date(order.createdAt).toLocaleDateString('es-AR')}</div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="text-xs font-medium text-zinc-900">{customerName}</div>
                    <div className="text-[11px] text-zinc-400">{customerEmail}</div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs font-bold text-zinc-900 tracking-tight">
                    ${totalFormatted}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <Badge variant={getStatusVariant(order.status)}>{getStatusText(order.status)}</Badge>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs font-medium">
                    <button className="text-zinc-500 hover:text-zinc-900 p-1 transition-colors" onClick={(e) => { e.stopPropagation(); onViewDetails(order); }} title="Ver detalles">
                      <FiEye size={15} />
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
