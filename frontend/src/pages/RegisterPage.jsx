import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import themeConfig from '../config/theme';

const RegisterPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50/50 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg p-8 sm:p-10 border border-zinc-200">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
            Nuevo Cliente
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 mt-1">
            Crear Cuenta
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Completá tus datos para una experiencia ágil en {themeConfig.brand.name}
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
