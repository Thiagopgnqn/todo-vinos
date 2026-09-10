import React from 'react';

const Badge = ({ children, variant = 'pending', className = '' }) => {
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    tinto: 'bg-[#722F37] text-white',
    blanco: 'bg-[#F2E8C6] text-gray-800',
    rosado: 'bg-[#FFC0CB] text-gray-800',
    espumante: 'bg-[#E5E4E2] text-gray-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const style = variants[variant] || variants.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
