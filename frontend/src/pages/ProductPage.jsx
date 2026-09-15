import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import useCart from '../hooks/useCart';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { FaArrowLeft } from 'react-icons/fa';

const wineTypeGradients = {
  TINTO: 'from-[#4a0e17] to-[#722F37]',
  BLANCO: 'from-[#bda55d] to-[#e6d8a7]',
  ROSADO: 'from-[#b84a62] to-[#d97d8f]',
  ESPUMANTE: 'from-[#8a7b4f] to-[#c2b078]',
};

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await client.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Producto no encontrado');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (error || !product) return (
    <div className="py-20 text-center">
      <p className="text-xl text-red-600 mb-4">{error || 'Producto no encontrado'}</p>
      <Link to="/catalogo" className="text-wine underline font-medium">Volver al catálogo</Link>
    </div>
  );

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  const imageUrl = product.imageUrl || product.image;
  const typeKey = (product.type || 'TINTO').toUpperCase();
  const bgGradient = wineTypeGradients[typeKey] || 'from-gray-700 to-gray-900';
  const priceFormatted = Number(product.price).toLocaleString('es-AR');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/catalogo" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-wine mb-8 transition-colors">
        <FaArrowLeft className="mr-2" /> Volver al catálogo
      </Link>
      
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        {/* Image / Card visual */}
        <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100 mb-8 lg:mb-0 shadow-lg flex items-center justify-center">
          {imageUrl && !imgError ? (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-b ${bgGradient} flex flex-col items-center justify-center p-8 text-center text-white`}>
              <span className="text-6xl mb-4">🍷</span>
              <span className="font-playfair font-bold text-3xl leading-tight drop-shadow-md">{product.name}</span>
              <span className="text-sm uppercase tracking-widest mt-2 opacity-80">{product.winery}</span>
              <span className="text-xs mt-1 bg-white/20 px-3 py-1 rounded-full">{product.varietal} • {product.year}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-3">
              <Badge variant={typeKey.toLowerCase()}>{product.type}</Badge>
            </div>
            <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.winery && <p className="text-lg text-gold font-medium mb-6">{product.winery}</p>}
            
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
              <div>
                <span className="text-sm text-gray-500 mr-1">$</span>
                <span className="text-4xl font-bold text-wine">{priceFormatted}</span>
              </div>
              <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600 bg-green-50 px-3 py-1 rounded-full' : 'text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full'}`}>
                {product.stock > 0 ? `Stock disponible: ${product.stock} un.` : 'Sin stock'}
              </p>
            </div>
            {product.transferPrice && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
                <span className="text-sm text-green-700">💳 Precio por transferencia:</span>
                <span className="text-lg font-bold text-green-700">${Number(product.transferPrice).toLocaleString('es-AR')}</span>
              </div>
            )}
            {!product.transferPrice && <div className="mb-6" />}

            {(product.varietal || product.year || product.region) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700 mb-6 bg-gray-50 p-4 rounded-lg">
                {product.varietal && <div><span className="text-xs text-gray-400 block uppercase font-medium">Varietal</span> <span className="font-semibold">{product.varietal}</span></div>}
                {product.year && <div><span className="text-xs text-gray-400 block uppercase font-medium">Año</span> <span className="font-semibold">{product.year}</span></div>}
                {product.region && <div><span className="text-xs text-gray-400 block uppercase font-medium">Región</span> <span className="font-semibold">{product.region}</span></div>}
              </div>
            )}

            <div className="text-gray-600 mb-8 leading-relaxed">
              <p>{product.description || 'Sin descripción disponible.'}</p>
            </div>

            {product.stock > 0 && (
              <div className="flex items-end space-x-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <select 
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-wine focus:ring-wine py-2.5 px-3"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  >
                    {[...Array(Math.min(10, product.stock)).keys()].map(i => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <Button fullWidth size="lg" onClick={handleAdd}>
                    Agregar al carrito
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            {product.tastingNotes && (
              <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                <h3 className="font-playfair font-semibold text-lg text-gray-900 mb-1">🍇 Notas de cata</h3>
                <p className="text-sm text-gray-600">{product.tastingNotes}</p>
              </div>
            )}
            {product.pairing && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-playfair font-semibold text-lg text-gray-900 mb-1">🍽️ Maridaje sugerido</h3>
                <p className="text-sm text-gray-600">{product.pairing}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
