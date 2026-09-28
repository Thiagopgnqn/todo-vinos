import React from 'react';
import Spinner from './Spinner';

const Button = ({ children, variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled, className = '', ...props }) => {
  const baseStyles = 'inline-flex justify-center items-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-wine text-white hover:bg-opacity-90 focus:ring-wine',
    secondary: 'border border-wine text-wine hover:bg-wine hover:text-white focus:ring-wine',
    gold: 'bg-gold text-white hover:bg-opacity-90 focus:ring-gold',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const width = fullWidth ? 'w-full' : '';
  const stateClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${stateClasses} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2" color={variant === 'secondary' ? 'text-wine' : 'text-white'} />}
      {children}
    </button>
  );
};

export default Button;
