import React, { useState, useEffect, useRef } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import client from '../../api/client';
import { FiUploadCloud, FiTrash2, FiRefreshCw, FiLink } from 'react-icons/fi';

const ProductForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '', 
    description: '', 
    price: '', 
    transferPrice: '',
    stock: '', 
    type: 'General', 
    varietal: '',
    year: '', 
    winery: '', 
    region: '', 
    tastingNotes: '', 
    pairing: '', 
    imageUrl: ''
  });

  const [categories, setCategories] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await client.get('/wine-types');
        setCategories(res.data);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        transferPrice: initialData.transferPrice || '',
        stock: initialData.stock || '',
        type: initialData.type || categories[0]?.name || 'General',
        varietal: initialData.varietal || '',
        year: initialData.year || new Date().getFullYear(),
        winery: initialData.winery || '',
        region: initialData.region || '',
        tastingNotes: initialData.tastingNotes || '',
        pairing: initialData.pairing || '',
        imageUrl: initialData.imageUrl || initialData.image || '',
      });
      if (initialData.imageUrl && initialData.imageUrl.startsWith('http')) {
        setShowUrlInput(true);
      }
    } else {
      setFormData({
        name: '', 
        description: '', 
        price: '', 
        transferPrice: '',
        stock: '', 
        type: categories[0]?.name || 'General', 
        varietal: '',
        year: '', 
        winery: '', 
        region: '', 
        tastingNotes: '', 
        pairing: '', 
        imageUrl: ''
      });
      setUploadError('');
    }
  }, [initialData, categories]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe superar los 5MB.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Formato no válido. Usa JPG, PNG o WEBP.');
      return;
    }

    setUploadError('');
    setUploadingImage(true);

    try {
      const data = new FormData();
      data.append('image', file);

      const res = await client.post('/upload/image', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.url) {
        setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.response?.data?.error || 'Error al subir la imagen.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.imageUrl || !formData.imageUrl.trim()) {
      setUploadError('La foto del producto es obligatoria.');
      return;
    }
    
    const payload = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      type: formData.type.trim(),
      imageUrl: formData.imageUrl.trim(),

      description: formData.description ? formData.description.trim() : '',
      transferPrice: formData.transferPrice ? parseFloat(formData.transferPrice) : null,
      stock: formData.stock !== '' && formData.stock !== undefined && formData.stock !== null ? parseInt(formData.stock, 10) : 0,
      varietal: formData.varietal ? formData.varietal.trim() : '',
      year: formData.year ? parseInt(formData.year, 10) : null,
      winery: formData.winery ? formData.winery.trim() : '',
      region: formData.region ? formData.region.trim() : '',
      tastingNotes: formData.tastingNotes ? formData.tastingNotes.trim() : undefined,
      pairing: formData.pairing ? formData.pairing.trim() : undefined,
    };

    onSubmit(payload);
  };

  const typeOptions = categories.length > 0
    ? categories.map(t => ({ value: t.name, label: t.name }))
    : [
        { value: 'Tinto', label: 'Tinto' },
        { value: 'Blanco', label: 'Blanco' },
        { value: 'Rosado', label: 'Rosado' },
        { value: 'Espumante', label: 'Espumante' },
      ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pr-2">
      <Input label="Nombre del Vino *" name="name" required value={formData.name} onChange={handleChange} placeholder="Ej: Catena Zapata Malbec Argentino" />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Input label="Precio ($) *" type="number" name="price" required value={formData.price} onChange={handleChange} min="0" step="1" placeholder="Ej: 8500" />
        <Input label="Precio con Transferencia ($)" type="number" name="transferPrice" value={formData.transferPrice} onChange={handleChange} min="0" step="1" placeholder="Opcional" />
        <Input label="Stock (Botellas)" type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" placeholder="Ej: 50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Select label="Tipo de Vino *" name="type" required options={typeOptions} value={formData.type} onChange={handleChange} />
        <Input label="Varietal / Cepa" name="varietal" value={formData.varietal} onChange={handleChange} placeholder="Ej: Malbec / Cabernet Sauvignon" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Input label="Bodega" name="winery" value={formData.winery} onChange={handleChange} placeholder="Ej: Catena Zapata / Rutini" />
        <Input label="Añada / Cosecha" type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Ej: 2021" />
      </div>

      <Input label="Región / Origen" name="region" value={formData.region} onChange={handleChange} placeholder="Ej: Valle de Uco, Mendoza" />
      
      {/* Sección de Subida de Imagen */}
      <div className={`p-4 rounded-lg border transition-all ${!formData.imageUrl && uploadError ? 'border-rose-300 bg-rose-50/40' : 'border-zinc-200 bg-zinc-50'}`}>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
          Imagen del Producto *
        </label>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/jpeg,image/png,image/webp" 
          className="hidden" 
        />

        {formData.imageUrl ? (
          <div className="flex items-center space-x-3.5 bg-white p-3 rounded-md border border-zinc-200">
            <div className="w-16 h-16 bg-zinc-100 rounded overflow-hidden flex-shrink-0 border border-zinc-200 flex items-center justify-center">
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1 border border-emerald-200">
                ✓ Imagen cargada
              </span>
              <p className="text-xs text-zinc-400 truncate font-mono">
                {formData.imageUrl}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded transition-colors flex items-center"
                >
                  <FiRefreshCw className="mr-1 text-xs" /> Cambiar
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded transition-colors flex items-center border border-rose-200"
                >
                  <FiTrash2 className="mr-1 text-xs" /> Quitar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="w-full border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-lg p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center group bg-white"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <FiUploadCloud size={20} />
              </div>
              <span className="text-xs font-semibold text-zinc-800">
                {uploadingImage ? 'Subiendo imagen...' : 'Seleccionar archivo de imagen'}
              </span>
              <span className="text-[11px] text-zinc-400 mt-1">
                JPG, PNG o WEBP (Máx. 5MB)
              </span>
            </button>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-rose-700 mt-2 bg-rose-50 p-2 rounded border border-rose-200 font-medium">
            {uploadError}
          </p>
        )}

        {/* Toggle manual URL */}
        <div className="mt-2.5 text-right">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-zinc-500 hover:text-zinc-900 underline inline-flex items-center transition-colors"
          >
            <FiLink className="mr-1 text-xs" />
            {showUrlInput ? 'Ocultar URL directa' : 'Ingresar URL de imagen'}
          </button>
        </div>

        {showUrlInput && (
          <div className="mt-2">
            <Input 
              label="URL directa de la imagen" 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleChange} 
              placeholder="https://ejemplo.com/foto.jpg" 
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">Descripción</label>
        <textarea 
          name="description" 
          rows="3" 
          value={formData.description} 
          onChange={handleChange} 
          className="block w-full rounded-md border border-zinc-200 bg-white text-zinc-900 text-xs sm:text-sm p-3 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400"
          placeholder="Descripción detallada del producto..."
        ></textarea>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">Notas de Cata</label>
        <textarea 
          name="tastingNotes" 
          rows="2" 
          value={formData.tastingNotes} 
          onChange={handleChange} 
          className="block w-full rounded-md border border-zinc-200 bg-white text-zinc-900 text-xs sm:text-sm p-3 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400"
          placeholder="Ej: Aromas a frutos rojos maduros, violetas, notas de vainilla y roble francés..."
        ></textarea>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">Maridaje Sugerido &amp; Servicio</label>
        <textarea 
          name="pairing" 
          rows="2" 
          value={formData.pairing} 
          onChange={handleChange} 
          className="block w-full rounded-md border border-zinc-200 bg-white text-zinc-900 text-xs sm:text-sm p-3 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400"
          placeholder="Ej: Carnes rojas a las brasas, pastas rellenas. Servir entre 16°C y 18°C..."
        ></textarea>
      </div>

      <div className="pt-3">
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading || uploadingImage} 
          disabled={uploadingImage}
          fullWidth
          className="py-3 text-xs sm:text-sm font-semibold"
        >
          {initialData ? 'Actualizar Etiqueta' : 'Guardar Vino en Catálogo'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
