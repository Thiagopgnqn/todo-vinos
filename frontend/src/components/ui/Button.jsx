import React from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex justify-center items-center font-medium rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 select-none active:scale-[0.99] disabled:active:scale-100';

  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900 shadow-soft border border-transparent',
    secondary: 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 focus:ring-zinc-900 shadow-soft',
    white: 'bg-white text-zinc-950 hover:bg-zinc-100 focus:ring-white shadow-md border border-transparent font-semibold',
    outlineWhite: 'border-2 border-white text-white bg-black/20 backdrop-blur-xs hover:bg-white hover:text-zinc-950 focus:ring-white transition-colors font-semibold',
    ghost: 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-500 border border-transparent',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 focus:ring-rose-700 shadow-soft border border-transparent',
    gold: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900 shadow-soft border border-transparent',
    outline: 'border border-zinc-900 text-zinc-900 bg-transparent hover:bg-zinc-900 hover:text-white focus:ring-zinc-900',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm font-semibold',
  };

  const width = fullWidth ? 'w-full' : '';
  const stateClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${width} ${stateClasses} ${className}`}
      {...props}
    >
      {loading && (
        <Spinner
          size="sm"
          className="mr-2"
          color={variant === 'secondary' || variant === 'ghost' ? 'text-zinc-900' : 'text-white'}
        />
      )}
      {children}
    </button>
  );
};

export default Button;
