import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    // Estados de pedidos
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    confirmed: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-semibold',
    delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-800 border-rose-200',

    // Tipos de producto / Categorías (neutros sobrios)
    tinto: 'bg-zinc-900 text-white border-transparent',
    blanco: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    rosado: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    espumante: 'bg-zinc-100 text-zinc-800 border-zinc-200',

    // E-commerce tags
    new: 'bg-zinc-900 text-white border-transparent',
    sale: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    default: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  };

  const style = variants[variant?.toLowerCase()] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase border ${style} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
