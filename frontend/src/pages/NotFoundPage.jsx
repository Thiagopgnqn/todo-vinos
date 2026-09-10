import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-playfair text-9xl font-bold text-wine mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">Lo sentimos, no pudimos encontrar la página que estás buscando. Puede que haya sido movida o eliminada.</p>
      <Link to="/">
        <Button variant="primary" size="lg">Volver al inicio</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
