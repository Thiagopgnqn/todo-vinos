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
      <div className="p-8 text-center bg-cream rounded-xl border border-parchment text-slate text-xs font-light">
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
              className="bg-white p-4 rounded-xl border border-parchment shadow-soft hover:border-wine/40 active:bg-cream-dark transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between pb-2 border-b border-parchment mb-2">
                <span className="text-[11px] font-mono font-semibold text-slate">
                  #{orderId.substring(0, 8)}
                </span>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-night flex items-center">
                    <FaUser className="mr-1.5 text-[10px] text-slate" />
                    {customerName}
                  </h4>
                  <p className="text-[11px] text-slate flex items-center mt-1 font-light">
                    <FaCalendarAlt className="mr-1.5 text-[9px] text-slate" />
                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                  </p>
                </div>

                <div className="text-right flex items-center space-x-2">
                  <div>
                    <span className="text-[9px] text-slate block uppercase font-medium">Total</span>
                    <span className="text-sm font-bold text-wine">${totalFormatted}</span>
                  </div>
                  <FaChevronRight className="text-parchment text-xs" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (screens >= 768px) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-soft border border-parchment">
        <table className="min-w-full divide-y divide-parchment">
          <thead className="bg-cream-dark/60">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-charcoal uppercase tracking-wider">ID / Fecha</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-charcoal uppercase tracking-wider">Cliente</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-charcoal uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-charcoal uppercase tracking-wider">Estado</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-charcoal uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-parchment/60">
            {orders.map(order => {
              const orderId = order.id || order._id;
              const customerName = order.customerName || order.name || 'Cliente';
              const customerEmail = order.customerEmail || order.email || '';
              const totalFormatted = Number(order.total || 0).toLocaleString('es-AR');

              return (
                <tr key={orderId} className="hover:bg-cream/50 cursor-pointer transition-colors" onClick={() => onViewDetails(order)}>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="text-xs font-semibold text-night truncate w-28 font-mono" title={orderId}>
                      #{orderId.substring(0, 8)}
                    </div>
                    <div className="text-[11px] text-slate font-light">{new Date(order.createdAt).toLocaleDateString('es-AR')}</div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="text-xs font-medium text-night">{customerName}</div>
                    <div className="text-[11px] text-slate font-light">{customerEmail}</div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs font-bold text-wine tracking-tight">
                    ${totalFormatted}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <Badge variant={getStatusVariant(order.status)}>{getStatusText(order.status)}</Badge>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs font-medium">
                    <button className="text-slate hover:text-wine p-1 transition-colors" onClick={(e) => { e.stopPropagation(); onViewDetails(order); }} title="Ver detalles">
                      <FaEye size={16} />
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
