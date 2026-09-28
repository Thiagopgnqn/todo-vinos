import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border-t-4 border-wine">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-3xl font-bold text-gray-900">Bienvenido</h2>
          <p className="mt-2 text-sm text-gray-600">Iniciá sesión para acceder a tu cuenta</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
