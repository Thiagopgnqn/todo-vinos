import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { FaShieldAlt, FaUser, FaInfoCircle } from 'react-icons/fa';

const UserForm = ({ initialData, currentUserId, onSubmit, loading }) => {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <Input
          label="Nombre y Apellido"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ej: Juan Pérez"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="juan@email.com"
          />

          <Input
            label="Teléfono / WhatsApp"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ej: +54 9 261 123 4567"
          />
        </div>

        {/* Role Selection */}
        <div className="pt-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Rol del Usuario
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Customer Option */}
            <div
              onClick={() => handleRoleSelect('CUSTOMER')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                formData.role === 'CUSTOMER'
                  ? 'border-wine bg-wine/5 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  formData.role === 'CUSTOMER'
                    ? 'bg-wine text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <FaUser size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Cliente</span>
                  <input
                    type="radio"
                    name="role"
                    value="CUSTOMER"
                    checked={formData.role === 'CUSTOMER'}
                    onChange={() => handleRoleSelect('CUSTOMER')}
                    disabled={isSelf}
                    className="text-wine focus:ring-wine"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Puede comprar, ver catálogo y consultar su historial de pedidos.
                </p>
              </div>
            </div>

            {/* Admin Option */}
            <div
              onClick={() => handleRoleSelect('ADMIN')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                formData.role === 'ADMIN'
                  ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  formData.role === 'ADMIN'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <FaShieldAlt size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Administrador</span>
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    checked={formData.role === 'ADMIN'}
                    onChange={() => handleRoleSelect('ADMIN')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Acceso total: gestión de productos, pedidos, estadísticas y usuarios.
                </p>
              </div>
            </div>
          </div>

          {isSelf && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-2 flex items-center space-x-1.5">
              <FaInfoCircle className="flex-shrink-0 text-amber-600" />
              <span>
                Estás editando tu propia cuenta. Por seguridad no podés quitarte el rol de Administrador.
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;

