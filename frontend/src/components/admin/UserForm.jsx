import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { FiShield, FiUser, FiInfo } from 'react-icons/fi';

const UserForm = ({ initialData, currentUserId, onSubmit, loading, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
  });

  const isSelf = initialData?.id === currentUserId;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        role: initialData.role || 'CUSTOMER',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (newRole) => {
    if (isSelf && newRole !== 'ADMIN') {
      alert('No podés removerte a vos mismo el rol de Administrador.');
      return;
    }
    setFormData((prev) => ({ ...prev, role: newRole }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3.5">
        <Input
          label="Nombre y Apellido"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ej: Marcos Silva"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="marcos@email.com"
          />

          <Input
            label="Teléfono / WhatsApp"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ej: 11 2345 6789"
          />
        </div>

        {/* Selección de Rol */}
        <div className="pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
            Rol de Acceso
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cliente */}
            <div
              onClick={() => handleRoleSelect('CUSTOMER')}
              className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start space-x-3 ${
                formData.role === 'CUSTOMER'
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
              } ${isSelf ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div
                className={`p-2 rounded mt-0.5 ${
                  formData.role === 'CUSTOMER'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                <FiUser size={14} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900">Cliente</span>
                  <input
                    type="radio"
                    name="role"
                    value="CUSTOMER"
                    checked={formData.role === 'CUSTOMER'}
                    onChange={() => handleRoleSelect('CUSTOMER')}
                    disabled={isSelf}
                    className="text-zinc-900 focus:ring-zinc-900 h-3.5 w-3.5"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                  Acceso estándar para compras y seguimiento de órdenes.
                </p>
              </div>
            </div>

            {/* Administrador */}
            <div
              onClick={() => handleRoleSelect('ADMIN')}
              className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start space-x-3 ${
                formData.role === 'ADMIN'
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
              }`}
            >
              <div
                className={`p-2 rounded mt-0.5 ${
                  formData.role === 'ADMIN'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                <FiShield size={14} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900">Administrador</span>
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    checked={formData.role === 'ADMIN'}
                    onChange={() => handleRoleSelect('ADMIN')}
                    className="text-zinc-900 focus:ring-zinc-900 h-3.5 w-3.5"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                  Acceso completo a productos, pedidos, estadísticas y cuentas.
                </p>
              </div>
            </div>
          </div>

          {isSelf && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2.5 mt-2.5 flex items-center space-x-2">
              <FiInfo className="flex-shrink-0" size={14} />
              <span>
                Estás editando tu propia cuenta. Por seguridad no podés removerte el rol de Administrador.
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2.5 pt-3 border-t border-zinc-100">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="text-xs">
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading} disabled={loading} className="px-5 text-xs">
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
