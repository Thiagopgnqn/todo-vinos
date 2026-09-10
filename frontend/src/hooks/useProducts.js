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
      // Depending on API response structure, adjust this:
      if (res.data.products) {
        setProducts(res.data.products);
        setPagination({
          page: res.data.page || 1,
          totalPages: res.data.totalPages || 1,
          total: res.data.total || res.data.products.length,
        });
      } else {
        setProducts(res.data);
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
