import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ initialQuery = '', onSearch }) => {
  const [query, setQuery] = useState(initialQuery);
  const onSearchRef = useRef(onSearch);
  const isInitialMount = useRef(true);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearchRef.current(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    onSearchRef.current('');
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
        <FiSearch className="h-4 w-4" />
      </div>
      <input
        type="text"
        className="block w-full pl-9 pr-8 py-2 rounded-md border border-zinc-200 bg-white text-zinc-900 text-xs sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-smooth"
        placeholder="Buscar por nombre, categoría o variante..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors"
          title="Limpiar búsqueda"
        >
          <FiX className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
