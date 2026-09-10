import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import client from '../../api/client';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import AddressMap from './AddressMap';
import { FaWhatsapp, FaStore, FaTruck, FaCheckCircle } from 'react-icons/fa';

const CheckoutForm = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    deliveryMethod: 'PICKUP',
    comments: '',
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || user.name || '',
        customerEmail: prev.customerEmail || user.email || '',
        customerPhone: prev.customerPhone || user.phone || '',
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerAddress: formData.deliveryMethod === 'DELIVERY' ? formData.customerAddress.trim() : undefined,
        deliveryMethod: formData.deliveryMethod,
        comments: formData.comments?.trim() || undefined,
        items: items.map(item => ({
          productId: item.product.id || item.product._id,
          quantity: item.quantity,
        })),
      };

      const res = await client.post('/orders', orderData);
      const link = res.data?.whatsappLink;
      
      if (link) {
        setWhatsappUrl(link);
        // Try opening WhatsApp
        window.open(link, '_blank');
      }
      
      clearCart();
      setSuccess(true);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.errors?.[0]?.message || 'Error al procesar el pedido. Verificá el stock disponible.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 sm:py-16 px-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <FaCheckCircle size={44} />
        </div>
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-3">¡Pedido Registrado con Éxito!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
          Tu orden fue guardada en el sistema. Para finalizar y coordinar el pago y la entrega, enviá el mensaje prearmado por WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          {whatsappUrl && (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              <FaWhatsapp size={22} />
              <span>Abrir WhatsApp Ahora</span>
            </a>
          )}
          <a 
            href="/" 
            className="flex items-center justify-center px-6 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Volver a la Tienda
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80 space-y-6">
      <div>
        <h2 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900">1. Datos de Contacto</h2>
        <p className="text-xs text-gray-500 mt-0.5">Te contactaremos a este número para coordinar el pago</p>
      </div>
      
      <div className="space-y-4">
        <Input 
          label="Nombre y Apellido" 
          name="customerName" 
          required 
          value={formData.customerName} 
          onChange={handleChange} 
          placeholder="Ej: Juan Pérez"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            label="Email" 
            type="email" 
            name="customerEmail" 
            required 
            value={formData.customerEmail} 
            onChange={handleChange} 
            placeholder="juan@email.com"
          />
          <Input 
            label="Teléfono / WhatsApp" 
            type="tel" 
            name="customerPhone" 
            required 
            value={formData.customerPhone} 
            onChange={handleChange} 
            placeholder="Ej: 11 2345 6789"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h2 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900 mb-1">2. Forma de Entrega</h2>
        <p className="text-xs text-gray-500 mb-4">Seleccioná cómo querés recibir tus vinos</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label 
            className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.deliveryMethod === 'PICKUP' 
                ? 'border-wine bg-wine/5 shadow-xs' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input 
              type="radio" 
              name="deliveryMethod" 
              value="PICKUP" 
              checked={formData.deliveryMethod === 'PICKUP'} 
              onChange={handleChange} 
              className="text-wine focus:ring-wine mt-1" 
            />
            <div className="ml-3">
              <span className="flex items-center text-sm font-bold text-gray-900">
                <FaStore className="mr-1.5 text-wine" /> Retiro en Local
              </span>
              <p className="text-xs text-gray-500 mt-1">Gratis &bull; Coordinamos horario por WhatsApp</p>
            </div>
          </label>

          <label 
            className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.deliveryMethod === 'DELIVERY' 
                ? 'border-wine bg-wine/5 shadow-xs' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input 
              type="radio" 
              name="deliveryMethod" 
              value="DELIVERY" 
              checked={formData.deliveryMethod === 'DELIVERY'} 
              onChange={handleChange} 
              className="text-wine focus:ring-wine mt-1" 
            />
            <div className="ml-3">
              <span className="flex items-center text-sm font-bold text-gray-900">
                <FaTruck className="mr-1.5 text-wine" /> Envío a Domicilio
              </span>
              <p className="text-xs text-gray-500 mt-1">Embalaje especial seguro</p>
            </div>
          </label>
        </div>
        
        {formData.deliveryMethod === 'DELIVERY' && (
          <div className="mt-4 pt-2 space-y-1">
            <Input 
              label="Dirección completa y localidad" 
              name="customerAddress" 
              required 
              value={formData.customerAddress} 
              onChange={handleChange} 
              placeholder="Ej: Av. Santa Fe 1234, Piso 4B, Córdoba"
            />
            <AddressMap 
              address={formData.customerAddress}
              onAddressConfirmed={(data) => {
                // Address confirmed by user on map
                console.log('Dirección confirmada:', data);
              }}
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-6">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Notas o comentarios para el pedido (Opcional)
        </label>
        <textarea 
          name="comments" 
          rows="2" 
          value={formData.comments} 
          onChange={handleChange} 
          className="block w-full rounded-xl border-gray-300 shadow-xs focus:border-wine focus:ring-wine text-sm p-3"
          placeholder="Ej: Envolver para regalo, tocar timbre, etc."
        ></textarea>
      </div>

      {error && (
        <div className="text-red-600 text-xs sm:text-sm bg-red-50 p-3.5 rounded-xl border border-red-200">
          {error}
        </div>
      )}
      
      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20bd5a] active:scale-99 text-white py-4 px-6 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          <FaWhatsapp size={24} />
          <span>{loading ? 'Procesando pedido...' : 'Confirmar Pedido por WhatsApp'}</span>
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          🔒 No se requiere tarjeta &bull; Coordinás el pago directo con la vinoteca
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;
