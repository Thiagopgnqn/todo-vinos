import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas. Verificá tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Correo Electrónico" 
        type="email" 
        required 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="tu@email.com"
      />
      <Input 
        label="Contraseña" 
        type="password" 
        required 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="••••••••"
      />
      
      {error && (
        <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200 font-medium">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" fullWidth size="md" loading={loading} className="py-2.5 text-xs sm:text-sm mt-2">
        Ingresar a mi Cuenta
      </Button>

      <div className="text-center text-xs text-zinc-500 pt-3 border-t border-zinc-100">
        ¿Aún no tenés cuenta?{' '}
        <Link to="/registro" className="text-zinc-900 font-medium hover:underline">
          Registrate acá
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
