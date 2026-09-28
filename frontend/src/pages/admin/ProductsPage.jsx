import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import ProductTable from '../../components/admin/ProductTable';
import ProductForm from '../../components/admin/ProductForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PAGE_SIZE = 20;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchProducts = async (targetPage = page) => {
    try {
      const res = await client.get(`/products?page=${targetPage}&limit=${PAGE_SIZE}`);
      const data = res.data;
      setProducts(data.products || data);
      setTotal(data.total ?? (data.products || data).length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingProduct) {
        await client.put(`/products/${editingProduct._id || editingProduct.id}`, formData);
      } else {
        await client.post('/products', formData);
      }
      await fetchProducts(page);
      handleCloseModal();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/products/${id}`);
      // Si borrás el último producto de una página que no es la primera, retrocedé una página
      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchProducts(page);
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <FaPlus className="mr-2" /> Nuevo Producto
        </Button>
      </div>

      <ProductTable products={products} onEdit={handleOpenModal} onDelete={handleDelete} />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-gray-500">
            Página {page} de {totalPages} — {total} productos en total
          </p>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}>
        <ProductForm initialData={editingProduct} onSubmit={handleSubmit} loading={loading} />
      </Modal>
    </div>
  );
};

export default ProductsPage;