import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FiAlertCircle } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center bg-white">
      <FiAlertCircle className="text-4xl text-zinc-300 mb-3" />
      <h1 className="text-7xl sm:text-8xl font-bold text-zinc-900 mb-2 tracking-tighter">404</h1>
      <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 mb-2">Página no encontrada</h2>
      <p className="text-zinc-500 text-xs sm:text-sm font-normal mb-8 max-w-sm leading-relaxed">
        El enlace que intentaste abrir no existe, cambió de dirección o fue removido.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg" className="px-6 text-xs sm:text-sm">
          Volver a la tienda
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
