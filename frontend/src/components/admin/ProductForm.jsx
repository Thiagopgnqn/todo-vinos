import React, { useState, useEffect, useRef } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import client from '../../api/client';
import { FaCloudUploadAlt, FaTrash, FaSyncAlt, FaLink } from 'react-icons/fa';

const ProductForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '', 
    description: '', 
    price: '', 
    transferPrice: '',
    stock: '', 
    type: 'TINTO', 
    varietal: '',
    year: new Date().getFullYear(), 
    winery: '', 
    region: '', 
    tastingNotes: '', 
    pairing: '', 
    imageUrl: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        transferPrice: initialData.transferPrice || '',
        stock: initialData.stock || '',
        type: (initialData.type || 'TINTO').toUpperCase(),
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
        type: 'TINTO', 
        varietal: '',
        year: new Date().getFullYear(), 
        winery: '', 
        region: '', 
        tastingNotes: '', 
        pairing: '', 
        imageUrl: ''
      });
      setUploadError('');
    }
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe superar los 5MB.');
      return;
    }

    // Validate format
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
      setUploadError(err.response?.data?.error || 'Error al subir la imagen desde tu dispositivo.');
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
    
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      transferPrice: formData.transferPrice ? parseFloat(formData.transferPrice) : null,
      stock: parseInt(formData.stock, 10),
      type: formData.type.toUpperCase(),
      varietal: formData.varietal.trim(),
      year: parseInt(formData.year, 10),
      winery: formData.winery.trim(),
      region: formData.region.trim(),
      tastingNotes: formData.tastingNotes ? formData.tastingNotes.trim() : undefined,
      pairing: formData.pairing ? formData.pairing.trim() : undefined,
      imageUrl: formData.imageUrl ? formData.imageUrl.trim() : undefined,
    };

    onSubmit(payload);
  };

  const typeOptions = [
    { value: 'TINTO', label: 'Tinto' },
    { value: 'BLANCO', label: 'Blanco' },
    { value: 'ROSADO', label: 'Rosado' },
    { value: 'ESPUMANTE', label: 'Espumante' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pr-2">
      <Input label="Nombre del Vino" name="name" required value={formData.name} onChange={handleChange} placeholder="Ej: Gran Reserva Malbec" />
      
      <div className="grid grid-cols-3 gap-4">
        <Input label="Precio Publicado ($)" type="number" name="price" required value={formData.price} onChange={handleChange} min="0" step="1" placeholder="Ej: 8500" />
        <Input label="Precio Transferencia ($)" type="number" name="transferPrice" value={formData.transferPrice} onChange={handleChange} min="0" step="1" placeholder="Opcional" />
        <Input label="Stock (unidades)" type="number" name="stock" required value={formData.stock} onChange={handleChange} min="0" placeholder="Ej: 50" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select label="Tipo" name="type" options={typeOptions} value={formData.type} onChange={handleChange} />
        <Input label="Varietal" name="varietal" required value={formData.varietal} onChange={handleChange} placeholder="Ej: Malbec" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Bodega" name="winery" required value={formData.winery} onChange={handleChange} placeholder="Ej: Catena Zapata" />
        <Input label="Año / Añada" type="number" name="year" required value={formData.year} onChange={handleChange} placeholder="Ej: 2021" />
      </div>

      <Input label="Región" name="region" required value={formData.region} onChange={handleChange} placeholder="Ej: Mendoza, Valle de Uco" />
      
      {/* Image Upload Section */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Foto del Producto
        </label>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/jpeg,image/png,image/webp" 
          className="hidden" 
        />

        {formData.imageUrl ? (
          <div className="flex items-center space-x-4 bg-white p-3 rounded-lg border border-gray-200">
            <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border flex items-center justify-center">
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded inline-block mb-1">
                ✓ Imagen cargada
              </p>
              <p className="text-xs text-gray-500 truncate" title={formData.imageUrl}>
                {formData.imageUrl}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center"
                >
                  <FaSyncAlt className="mr-1.5" /> Cambiar foto
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center"
                >
                  <FaTrash className="mr-1.5" /> Quitar
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
              className="w-full border-2 border-dashed border-gray-300 hover:border-wine hover:bg-wine/5 rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center group"
            >
              <div className="w-12 h-12 rounded-full bg-wine/10 text-wine flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FaCloudUploadAlt size={24} />
              </div>
              <span className="text-sm font-semibold text-gray-900 group-hover:text-wine">
                {uploadingImage ? 'Subiendo imagen...' : 'Hacé clic para seleccionar una foto de tu dispositivo'}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Formatos permitidos: JPG, PNG o WEBP (Máx. 5MB)
              </span>
            </button>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-200">
            {uploadError}
          </p>
        )}

        {/* Toggle manual URL */}
        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-gray-500 hover:text-wine underline inline-flex items-center"
          >
            <FaLink className="mr-1" />
            {showUrlInput ? 'Ocultar URL manual' : '¿Preferís pegar una URL de imagen?'}
          </button>
        </div>

        {showUrlInput && (
          <div className="mt-2">
            <Input 
              label="URL directa de la imagen" 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleChange} 
              placeholder="https://ejemplo.com/foto-vino.jpg" 
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea 
          name="description" 
          rows="3" 
          required 
          value={formData.description} 
          onChange={handleChange} 
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-wine focus:ring-wine sm:text-sm"
          placeholder="Descripción detallada del vino..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas de Cata (Opcional)</label>
        <textarea 
          name="tastingNotes" 
          rows="2" 
          value={formData.tastingNotes} 
          onChange={handleChange} 
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-wine focus:ring-wine sm:text-sm"
          placeholder="Ej: Aromas a frutos rojos, ciruela madura y vainilla..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Maridaje Sugerido (Opcional)</label>
        <textarea 
          name="pairing" 
          rows="2" 
          value={formData.pairing} 
          onChange={handleChange} 
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-wine focus:ring-wine sm:text-sm"
          placeholder="Ej: Ideal para acompañar carnes rojas asadas, pastas..."
        ></textarea>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading || uploadingImage} 
          disabled={uploadingImage}
          fullWidth
        >
          {initialData ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
