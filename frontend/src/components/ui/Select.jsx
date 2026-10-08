import React, { forwardRef } from 'react';

const Select = forwardRef(({ label, error, options, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-zinc-700 mb-1.5 tracking-normal">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`block w-full rounded-md bg-white border border-zinc-200 text-zinc-900 text-sm py-2 px-3 transition-smooth focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-soft ${
          error ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-600' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
