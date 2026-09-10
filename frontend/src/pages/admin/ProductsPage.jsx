import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import ProductTable from '../../components/admin/ProductTable';
import ProductForm from '../../components/admin/ProductForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { FaPlus } from 'react-icons/fa';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await client.get('/products');
      setProducts(res.data.products || res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      await fetchProducts();
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
      await fetchProducts();
    } catch (error) {
      alert('Error al eliminar');
    }
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}>
        <ProductForm initialData={editingProduct} onSubmit={handleSubmit} loading={loading} />
      </Modal>
    </div>
  );
};

export default ProductsPage;
