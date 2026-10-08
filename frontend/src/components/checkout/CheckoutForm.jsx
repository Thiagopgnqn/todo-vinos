import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import AddressMap from './AddressMap';
import Input from '../ui/Input';
import Button from '../ui/Button';
import client from '../../api/client';
import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCheckCircle, FiLock } from 'react-icons/fi';
import themeConfig from '../../config/theme';

const CheckoutForm = () => {
  const { items, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const minUnits = themeConfig.brand.minOrderUnits || 6;
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerProvince: '',
    customerCity: '',
    customerPostalCode: '',
    customerAddress: '',
    deliveryMethod: 'DELIVERY',
    comments: '',
  });

  // Autocompletar datos del usuario si está autenticado
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

    if (cartCount < minUnits) {
      setError(`El pedido mínimo es de ${minUnits} ${themeConfig.brand.unitNamePlural}. Tenés ${cartCount} en tu carrito.`);
      setLoading(false);
      return;
    }
    
    try {
      const fullAddress = [
        formData.customerAddress.trim(),
        formData.customerCity.trim(),
        `CP ${formData.customerPostalCode.trim()}`,
        formData.customerProvince.trim(),
      ].filter(Boolean).join(', ');

      const orderData = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerAddress: fullAddress,
        customerProvince: formData.customerProvince.trim(),
        customerCity: formData.customerCity.trim(),
        customerPostalCode: formData.customerPostalCode.trim(),
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
        window.open(link, '_blank');
      }
      
      clearCart();
      setSuccess(true);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.errors?.[0]?.message || 'Error al procesar el pedido. Verificá los datos ingresados.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 px-6 bg-white rounded-lg border border-zinc-200">
        <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
          <FiCheckCircle size={28} />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
          ¡Orden Registrada!
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 mt-1 mb-2">
          Finalizá tu compra por WhatsApp
        </h2>
        <p className="text-zinc-500 mb-6 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
          Tu pedido ha sido reservado. Hacé clic a continuación para enviar los detalles de la orden y coordinar el despacho o pago.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto">
          {whatsappUrl && (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-md font-medium text-xs sm:text-sm transition-colors"
            >
              <FaWhatsapp size={18} />
              <span>Abrir WhatsApp Ahora</span>
            </a>
          )}
          <Link 
            to="/" 
            className="flex items-center justify-center px-5 py-3 rounded-md border border-zinc-200 text-zinc-800 text-xs font-medium hover:bg-zinc-50 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-lg border border-zinc-200 space-y-7">
      {/* Sección 1: Contacto */}
      <div>
        <div className="pb-3 mb-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Paso 1</span>
            <h2 className="text-lg font-semibold text-zinc-900">Datos de Contacto</h2>
          </div>
          <span className="text-xs text-zinc-400">Confirmación directa</span>
        </div>
        
        <div className="space-y-4">
          <Input 
            label="Nombre y Apellido" 
            name="customerName" 
            required 
            value={formData.customerName} 
            onChange={handleChange} 
            placeholder="Ej: Carolina Pérez"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Correo Electrónico" 
              type="email" 
              name="customerEmail" 
              required 
              value={formData.customerEmail} 
              onChange={handleChange} 
              placeholder="carolina@ejemplo.com"
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
      </div>

      {/* Sección 2: Destino */}
      <div className="pt-2">
        <div className="pb-3 mb-4 border-b border-zinc-100">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Paso 2</span>
          <h2 className="text-lg font-semibold text-zinc-900">Dirección de Entrega</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Provincia" 
              name="customerProvince" 
              required 
              value={formData.customerProvince} 
              onChange={handleChange} 
              placeholder="Ej: Buenos Aires"
            />
            <Input 
              label="Ciudad / Localidad" 
              name="customerCity" 
              required 
              value={formData.customerCity} 
              onChange={handleChange} 
              placeholder="Ej: La Plata"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Código Postal" 
              name="customerPostalCode" 
              required 
              value={formData.customerPostalCode} 
              onChange={handleChange} 
              placeholder="Ej: 1900"
            />
            <Input 
              label="Calle, Altura y Piso/Depto" 
              name="customerAddress" 
              required 
              value={formData.customerAddress} 
              onChange={handleChange} 
              placeholder="Ej: Calle 50 420, 4B"
            />
          </div>
          
          {/* Mapa de geolocalización */}
          <AddressMap 
            address={
              [formData.customerAddress, formData.customerCity, formData.customerPostalCode, formData.customerProvince]
                .filter(v => v && v.trim().length > 0)
                .join(', ')
            }
            onAddressConfirmed={(data) => {
              console.log('Dirección confirmada:', data);
            }}
          />
        </div>
      </div>

      {/* Sección 3: Notas */}
      <div className="pt-2 border-t border-zinc-100">
        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
          Notas de entrega (Opcional)
        </label>
        <textarea 
          name="comments" 
          rows="2" 
          value={formData.comments} 
          onChange={handleChange} 
          className="block w-full rounded-md border border-zinc-200 bg-white text-zinc-900 text-xs sm:text-sm p-3 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-smooth placeholder:text-zinc-400"
          placeholder="Ej: Tocar timbre B, dejar en portería..."
        ></textarea>
      </div>

      {error && (
        <div className="text-rose-700 text-xs bg-rose-50 p-3 rounded-md border border-rose-200 font-medium">
          {error}
        </div>
      )}
      
      {/* Botón de Confirmación por WhatsApp */}
      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3.5 px-6 rounded-md font-medium text-sm transition-smooth disabled:opacity-50"
        >
          <FaWhatsapp size={20} />
          <span>{loading ? 'Procesando orden...' : 'Confirmar Pedido por WhatsApp'}</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-zinc-400 mt-3">
          <FiLock className="text-zinc-500 text-[11px]" />
          <span>Sin ingreso de datos de tarjeta en el sitio &bull; Pago directo seguro</span>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
