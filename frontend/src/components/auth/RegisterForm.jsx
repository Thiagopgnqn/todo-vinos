import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }
    setError('');
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre completo" name="name" required value={formData.name} onChange={handleChange} />
      <Input label="Email" type="email" name="email" required value={formData.email} onChange={handleChange} />
      <Input label="Teléfono (Opcional)" name="phone" value={formData.phone} onChange={handleChange} />
      <Input label="Contraseña" type="password" name="password" required value={formData.password} onChange={handleChange} />
      <Input label="Confirmar Contraseña" type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
      
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-4">Registrarse</Button>
      <div className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tenés cuenta? <Link to="/login" className="text-wine font-medium hover:underline">Iniciá sesión</Link>
      </div>
    </form>
  );
};

export default RegisterForm;
