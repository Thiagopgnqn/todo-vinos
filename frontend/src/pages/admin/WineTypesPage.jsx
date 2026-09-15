import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { FaPlus, FaTrash, FaWineGlassAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const WineTypesPage = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTypeName, setNewTypeName] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await client.get('/wine-types');
      setTypes(res.data);
    } catch (err) {
      console.error('Error fetching wine types:', err);
      setFeedback({
        type: 'error',
        message: 'No se pudieron cargar los tipos de vino.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    setCreating(true);
    setFeedback({ type: '', message: '' });

    try {
      await client.post('/wine-types', { name: newTypeName.trim() });
      setNewTypeName('');
      setFeedback({
        type: 'success',
        message: `Tipo de vino "${newTypeName.trim()}" creado con éxito.`,
      });
      await fetchTypes();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error al crear el tipo de vino.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, name, productCount) => {
    if (productCount > 0) {
      alert(`No se puede eliminar "${name}" porque tiene ${productCount} producto(s) asignado(s). Reasigna o elimina los productos primero.`);
      return;
    }

    if (!window.confirm(`¿Estás seguro de que querés eliminar el tipo de vino "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    setFeedback({ type: '', message: '' });

    try {
      await client.delete(`/wine-types/${id}`);
      setFeedback({
        type: 'success',
        message: `Tipo de vino "${name}" eliminado con éxito.`,
      });
      await fetchTypes();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error al eliminar el tipo de vino.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-playfair">Tipos de Vino</h1>
        <p className="text-sm text-gray-500 mt-1">
          Administrá las categorías de vino disponibles. Los tipos que crees acá se usarán tanto al cargar productos como en los filtros del catálogo.
        </p>
      </div>

      {/* Feedback banner */}
      {feedback.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <FaCheckCircle className="text-green-600 flex-shrink-0" />
          ) : (
            <FaExclamationCircle className="text-red-600 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Formulario nuevo tipo */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaPlus className="text-wine text-sm" /> Agregar Nuevo Tipo de Vino
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              name="name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Ej: Orgánico, Naranjo, Dulce Natural, Fortificado..."
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={creating}
            disabled={creating || !newTypeName.trim()}
            className="whitespace-nowrap px-6"
          >
            <FaPlus className="mr-2" /> Crear Tipo
          </Button>
        </form>
      </div>

      {/* Lista de tipos existentes */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/60">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FaWineGlassAlt className="text-wine" /> Tipos de Vino Actuales ({types.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : types.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No hay tipos de vino registrados. Creá el primero arriba.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {types.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-wine/10 text-wine flex items-center justify-center font-bold text-base">
                    🍷
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.productCount === 0 ? (
                        <span className="text-gray-400">Sin productos asignados</span>
                      ) : (
                        <span className="text-wine font-medium">
                          {item.productCount} {item.productCount === 1 ? 'producto vinculado' : 'productos vinculados'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name, item.productCount)}
                    disabled={deletingId === item.id || item.productCount > 0}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      item.productCount > 0
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-red-600 bg-red-50 hover:bg-red-100'
                    }`}
                    title={
                      item.productCount > 0
                        ? 'No se puede eliminar porque tiene productos asociados'
                        : 'Eliminar tipo'
                    }
                  >
                    <FaTrash size={12} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WineTypesPage;

