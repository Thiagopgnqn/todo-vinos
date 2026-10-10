import { useState, useCallback } from 'react';
import client from '../api/client';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await client.get('/products', { params });
      const sortByStock = (list) => {
        if (!Array.isArray(list)) return [];
        return [...list].sort((a, b) => {
          const aInStock = Number(a?.stock) > 0 ? 1 : 0;
          const bInStock = Number(b?.stock) > 0 ? 1 : 0;
          return bInStock - aInStock;
        });
      };

      // Depending on API response structure, adjust this:
      if (res.data.products) {
        const total = res.data.total || res.data.products.length;
        const limit = res.data.limit || res.data.products.length || 1;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        setProducts(sortByStock(res.data.products));
        setPagination({
          page: res.data.page || 1,
          totalPages,
          total,
        });
      } else {
        setProducts(sortByStock(res.data));
      }
    } catch (err) {
      setError(err.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, pagination, fetchProducts };
};

export default useProducts;