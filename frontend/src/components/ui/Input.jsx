import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-zinc-700 mb-1.5 tracking-normal">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`block w-full rounded-md bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-sm py-2 px-3 transition-smooth focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-soft ${
            Icon ? 'pl-9' : 'pl-3'
          } ${
            error ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-600' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
