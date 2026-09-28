import React from 'react';
import { FaEdit, FaTrash, FaShieldAlt, FaUser, FaShoppingBag } from 'react-icons/fa';

const UserTable = ({ users, currentUserId, onEdit, onDelete }) => {
  return (
    <div>
      {/* Mobile Card List (screens < 768px) */}
      <div className="md:hidden space-y-3">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          const isAdmin = user.role === 'ADMIN';
          const orderCount = user._count?.orders ?? 0;
          const registeredDate = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '-';

          return (
            <div
              key={user.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm ${
                      isAdmin
                        ? 'bg-wine/10 text-wine border border-wine/30'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-bold text-gray-900 leading-tight">
                        {user.name}
                      </h4>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded">
                          Tú
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                    {user.phone && (
                      <p className="text-xs text-gray-400 mt-0.5">📞 {user.phone}</p>
                    )}
                  </div>
                </div>

                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isAdmin ? <FaShieldAlt className="text-[10px]" /> : <FaUser className="text-[10px]" />}
                  <span>{isAdmin ? 'Admin' : 'Cliente'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs">
                <div className="flex items-center space-x-3 text-gray-500">
                  <span className="flex items-center space-x-1">
                    <FaShoppingBag className="text-gray-400" />
                    <span>{orderCount} pedidos</span>
                  </span>
                  <span>&bull;</span>
                  <span>Reg: {registeredDate}</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 bg-gray-100 hover:bg-wine/10 text-wine rounded-lg transition-colors"
                    title="Modificar usuario y rol"
                  >
                    <FaEdit size={15} />
                  </button>
                  <button
                    disabled={isCurrentUser}
                    onClick={() => {
                      if (window.confirm(`¿Estás seguro de que querés eliminar al usuario ${user.name} (${user.email})?`)) {
                        onDelete(user.id);
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isCurrentUser
                        ? 'opacity-30 cursor-not-allowed text-gray-400 bg-gray-50'
                        : 'bg-gray-100 hover:bg-red-50 text-red-600'
                    }`}
                    title={isCurrentUser ? 'No podés eliminar tu propia cuenta' : 'Eliminar usuario'}
                  >
                    <FaTrash size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Data Table (screens >= 768px) */}
      <div className="hidden md:block bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Pedidos</th>
              <th className="px-6 py-4">Fecha Registro</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isAdmin = user.role === 'ADMIN';
              const orderCount = user._count?.orders ?? 0;
              const registeredDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-';

              return (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          isAdmin
                            ? 'bg-wine/10 text-wine border border-wine/30'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-gray-900 truncate">{user.name}</p>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded">
                              Tú
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.phone ? (
                      <span className="text-xs font-mono">{user.phone}</span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Sin teléfono</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isAdmin
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isAdmin ? <FaShieldAlt className="text-xs" /> : <FaUser className="text-xs" />}
                      <span>{isAdmin ? 'Administrador' : 'Cliente'}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                      <FaShoppingBag className="text-gray-400" />
                      <span>{orderCount} {orderCount === 1 ? 'pedido' : 'pedidos'}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-500">
                    {registeredDate}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 bg-gray-100 hover:bg-wine/10 text-wine rounded-lg transition-colors"
                      title="Editar usuario y cambiar rol"
                    >
                      <FaEdit size={15} />
                    </button>
                    <button
                      disabled={isCurrentUser}
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de que querés eliminar al usuario ${user.name} (${user.email})?`)) {
                          onDelete(user.id);
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isCurrentUser
                          ? 'opacity-30 cursor-not-allowed text-gray-400 bg-gray-50'
                          : 'bg-gray-100 hover:bg-red-50 text-red-600'
                      }`}
                      title={isCurrentUser ? 'No podés eliminar tu propia cuenta' : 'Eliminar usuario'}
                    >
                      <FaTrash size={15} />
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

export default UserTable;

