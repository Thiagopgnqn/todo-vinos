import React, { useState, useEffect, useMemo } from 'react';
import client from '../../api/client';
import useAuth from '../../hooks/useAuth';
import UserTable from '../../components/admin/UserTable';
import UserForm from '../../components/admin/UserForm';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { FiUsers, FiShield, FiUserCheck, FiSearch } from 'react-icons/fi';

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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${name}"?`)) {
      return;
    }

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

  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const customerCount = users.filter((u) => u.role !== 'ADMIN').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-zinc-200">
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Cuentas &bull; Clientes</span>
        <h1 className="text-2xl font-semibold text-zinc-900 mt-0.5">
          Gestión de Usuarios
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Administrá clientes registrados, asigná roles y permisos de acceso al sistema.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-zinc-200 flex items-center space-x-3.5">
          <div className="p-2.5 bg-zinc-100 text-zinc-700 rounded-md">
            <FiUsers size={18} />
          </div>
          <div>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Total Usuarios</p>
            <p className="text-xl font-bold text-zinc-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-zinc-200 flex items-center space-x-3.5">
          <div className="p-2.5 bg-zinc-100 text-zinc-700 rounded-md">
            <FiShield size={18} />
          </div>
          <div>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Administradores</p>
            <p className="text-xl font-bold text-zinc-900">{adminCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-zinc-200 flex items-center space-x-3.5">
          <div className="p-2.5 bg-zinc-100 text-zinc-700 rounded-md">
            <FiUserCheck size={18} />
          </div>
          <div>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Clientes</p>
            <p className="text-xl font-bold text-zinc-900">{customerCount}</p>
          </div>
        </div>
      </div>

      {/* Toolbar con búsqueda y filtros */}
      <div className="bg-white p-3.5 rounded-lg border border-zinc-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-zinc-900"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto w-full sm:w-auto overflow-x-auto">
          {['ALL', 'ADMIN', 'CUSTOMER'].map((rf) => (
            <button
              key={rf}
              type="button"
              onClick={() => setRoleFilter(rf)}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                roleFilter === rf
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {rf === 'ALL' ? 'Todos' : rf === 'ADMIN' ? 'Admins' : 'Clientes'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner text="Cargando usuarios..." />
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-800 text-xs rounded border border-rose-200">
          {error}
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          currentUserId={currentLoggedUser?.id}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Editar Usuario">
        {editingUser && (
          <UserForm
            initialData={editingUser}
            onSubmit={handleSubmit}
            loading={actionLoading}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;
