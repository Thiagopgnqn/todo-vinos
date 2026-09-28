import React, { useState, useEffect, useMemo } from 'react';
import client from '../../api/client';
import useAuth from '../../hooks/useAuth';
import UserTable from '../../components/admin/UserTable';
import UserForm from '../../components/admin/UserForm';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { FaUsers, FaUserShield, FaUserFriends, FaSearch } from 'react-icons/fa';

const UsersPage = () => {
  const { user: currentLoggedUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // ALL | ADMIN | CUSTOMER

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await client.get('/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Error al cargar la lista de usuarios'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (formData) => {
    if (!editingUser) return;
    setActionLoading(true);
    try {
      await client.put(`/users/${editingUser.id}`, formData);
      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Error al actualizar el usuario'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/users/${id}`);
      await fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Error al eliminar el usuario'
      );
    }
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.phone && u.phone.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        roleFilter === 'ALL' ? true : (u.role || 'CUSTOMER') === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Quick stats
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const customerCount = users.filter((u) => u.role !== 'ADMIN').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-playfair">
          Gestión de Usuarios
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Administrá los clientes registrados, asigná roles y permisos de acceso.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-wine/10 text-wine rounded-lg">
            <FaUsers size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Usuarios</p>
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-lg">
            <FaUserShield size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Administradores</p>
            <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
            <FaUserFriends size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Clientes</p>
            <p className="text-2xl font-bold text-gray-900">{customerCount}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Buscar por nombre, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-wine focus:border-wine"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex w-full sm:w-auto bg-gray-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-all ${
              roleFilter === 'ALL'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            onClick={() => setRoleFilter('ADMIN')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-all ${
              roleFilter === 'ADMIN'
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Admins ({adminCount})
          </button>
          <button
            onClick={() => setRoleFilter('CUSTOMER')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-all ${
              roleFilter === 'CUSTOMER'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Clientes ({customerCount})
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white text-center py-16 px-4 rounded-xl border border-gray-200">
          <FaUsers size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-700">No se encontraron usuarios</h3>
          <p className="text-xs text-gray-500 mt-1">
            {searchQuery || roleFilter !== 'ALL'
              ? 'Probá cambiando los filtros o el término de búsqueda.'
              : 'Todavía no hay usuarios registrados en el sistema.'}
          </p>
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          currentUserId={currentLoggedUser?.id}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Editar Usuario: ${editingUser?.name || ''}`}
      >
        <UserForm
          initialData={editingUser}
          currentUserId={currentLoggedUser?.id}
          onSubmit={handleSubmit}
          loading={actionLoading}
        />
      </Modal>
    </div>
  );
};

export default UsersPage;

