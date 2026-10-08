import React from 'react';
import { FiEdit2, FiTrash2, FiShield, FiUser, FiShoppingBag } from 'react-icons/fi';

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
              className="bg-white p-4 rounded-lg border border-zinc-200 shadow-soft flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${
                      isAdmin
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 leading-tight">
                        {user.name}
                      </h4>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-zinc-100 text-zinc-700 font-semibold px-1.5 py-0.2 rounded border border-zinc-200">
                          Tú
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
                    {user.phone && (
                      <p className="text-xs text-zinc-500 mt-0.5 font-mono">{user.phone}</p>
                    )}
                  </div>
                </div>

                <span
                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                  }`}
                >
                  {isAdmin ? <FiShield className="text-[10px]" /> : <FiUser className="text-[10px]" />}
                  <span>{isAdmin ? 'Admin' : 'Cliente'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-zinc-100 text-xs">
                <div className="flex items-center space-x-3 text-zinc-400">
                  <span className="flex items-center space-x-1">
                    <FiShoppingBag className="text-zinc-400" />
                    <span>{orderCount} pedidos</span>
                  </span>
                  <span>&bull;</span>
                  <span>Reg: {registeredDate}</span>
                </div>

                <div className="flex space-x-1.5">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded transition-colors border border-zinc-200"
                    title="Modificar usuario y rol"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    disabled={isCurrentUser}
                    onClick={() => {
                      if (window.confirm(`¿Estás seguro de que querés eliminar al usuario ${user.name} (${user.email})?`)) {
                        onDelete(user.id);
                      }
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      isCurrentUser
                        ? 'opacity-30 cursor-not-allowed text-zinc-400 bg-zinc-100'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                    title={isCurrentUser ? 'No podés eliminar tu propia cuenta' : 'Eliminar usuario'}
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Data Table (screens >= 768px) */}
      <div className="hidden md:block bg-white rounded-lg border border-zinc-200 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200 text-left">
          <thead className="bg-zinc-50 text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Usuario</th>
              <th className="px-5 py-3">Teléfono</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Pedidos</th>
              <th className="px-5 py-3">Fecha Registro</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs">
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
                <tr key={user.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isAdmin
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-zinc-900">{user.name}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-zinc-100 text-zinc-600 font-semibold px-1 py-0.2 rounded border border-zinc-200">
                              Tú
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-zinc-600">
                    {user.phone || '-'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        isAdmin
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      {isAdmin ? <FiShield className="text-[10px]" /> : <FiUser className="text-[10px]" />}
                      <span>{isAdmin ? 'Admin' : 'Cliente'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-zinc-700">
                    {orderCount}
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500">
                    {registeredDate}
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-zinc-500 hover:text-zinc-900 p-1"
                      title="Editar usuario"
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      disabled={isCurrentUser}
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de que querés eliminar al usuario ${user.name}?`)) {
                          onDelete(user.id, user.name);
                        }
                      }}
                      className={`p-1 ${
                        isCurrentUser
                          ? 'opacity-20 cursor-not-allowed text-zinc-300'
                          : 'text-zinc-400 hover:text-rose-600'
                      }`}
                      title={isCurrentUser ? 'No podés eliminar tu propia cuenta' : 'Eliminar usuario'}
                    >
                      <FiTrash2 size={13} />
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
