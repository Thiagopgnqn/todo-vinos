import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { FiPlus, FiTrash2, FiTag, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

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
      console.error('Error fetching categories:', err);
      setFeedback({
        type: 'error',
        message: 'No se pudieron cargar las categorías de productos.',
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
        message: `Categoría "${newTypeName.trim()}" creada con éxito.`,
      });
      await fetchTypes();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error al crear la categoría.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, name, productCount) => {
    if (productCount > 0) {
      alert(`No se puede eliminar "${name}" porque tiene ${productCount} producto(s) asignado(s). Reasigná o eliminá los productos primero.`);
      return;
    }

    if (!window.confirm(`¿Estás seguro de que querés eliminar la categoría "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    setFeedback({ type: '', message: '' });

    try {
      await client.delete(`/wine-types/${id}`);
      setFeedback({
        type: 'success',
        message: `Categoría "${name}" eliminada con éxito.`,
      });
      await fetchTypes();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error al eliminar la categoría.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-zinc-200">
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Configuración &bull; Catálogo</span>
        <h1 className="text-2xl font-semibold text-zinc-900 mt-0.5">Tipos &amp; Variedades de Vino</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Administrá las categorías de vinos disponibles para la asignación en catálogo y los filtros de navegación.
        </p>
      </div>

      {/* Feedback banner */}
      {feedback.message && (
        <div
          className={`p-3.5 rounded-md flex items-center gap-2.5 border text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <FiCheckCircle className="text-emerald-700 flex-shrink-0" size={16} />
          ) : (
            <FiAlertCircle className="text-rose-700 flex-shrink-0" size={16} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Formulario nueva categoría */}
      <div className="bg-white p-5 rounded-lg border border-zinc-200">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-3 flex items-center gap-1.5">
          <FiPlus className="text-zinc-600" /> Nuevo Tipo de Vino
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Input
              name="name"
              label="Nombre del Tipo de Vino *"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Ej: Tinto, Blanco, Rosado, Espumante, Naranjo..."
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={creating}
            disabled={creating || !newTypeName.trim()}
            className="whitespace-nowrap px-5 py-2.5 text-xs sm:text-sm"
          >
            <FiPlus className="mr-1.5" /> Crear Tipo
          </Button>
        </form>
      </div>

      {/* Lista de categorías */}
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">
            Categorías Registradas ({types.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Spinner text="Cargando categorías..." />
          </div>
        ) : types.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            No hay categorías creadas.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {types.map((type) => {
              const count = type.productCount ?? type._count?.products ?? 0;
              const isDeleting = deletingId === type.id;

              return (
                <div
                  key={type.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50/60 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-500">
                      <FiTag size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-zinc-900">{type.name}</h4>
                      <p className="text-[11px] text-zinc-400">
                        {count} {count === 1 ? 'producto asignado' : 'productos asignados'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(type.id, type.name, count)}
                    disabled={isDeleting || count > 0}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={count > 0 ? 'No se puede eliminar con productos asignados' : 'Eliminar categoría'}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WineTypesPage;
