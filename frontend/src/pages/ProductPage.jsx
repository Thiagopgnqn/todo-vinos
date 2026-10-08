import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import useCart from '../hooks/useCart';
import useSEO from '../hooks/useSEO';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { 
  FiArrowLeft, 
  FiShield, 
  FiTruck, 
  FiShoppingBag, 
  FiCheck, 
  FiInfo, 
  FiChevronDown, 
  FiChevronUp,
  FiMinus,
  FiPlus
} from 'react-icons/fi';
import themeConfig from '../config/theme';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openTab, setOpenTab] = useState('details');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await client.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Artículo no encontrado');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const imageUrl = product?.imageUrl || product?.image;
  const priceFormatted = Number(product?.price || 0).toLocaleString('es-AR');

  // Dynamic SEO & Google Product Rich Snippets
  useSEO(product ? {
    title: `${product.name} ${product.winery ? `- ${product.winery}` : ''}`,
    description: product.description 
      ? product.description.slice(0, 155)
      : `Comprá ${product.name} en ${themeConfig.brand.name}. Envíos a todo el país.`,
    keywords: `${product.name}, ${product.type || ''}, ${product.varietal || ''}, ${product.winery || ''}, tienda online`,
    image: imageUrl,
    type: 'product',
    structuredData: {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: imageUrl ? [imageUrl] : [],
      description: product.description || `Artículo ${product.name} en ${themeConfig.brand.name}.`,
      brand: {
        '@type': 'Brand',
        name: product.winery || themeConfig.brand.name,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'ARS',
        price: Number(product.price),
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: themeConfig.brand.name,
        },
      },
    },
  } : {});

  if (loading) {
    return (
      <div className="py-32 flex justify-center bg-white">
        <Spinner size="lg" text="Cargando detalles del producto..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center px-4 bg-white max-w-md mx-auto">
        <FiShoppingBag className="mx-auto text-4xl text-zinc-300 mb-3" />
        <h2 className="text-xl font-semibold text-zinc-900 mb-2">{error || 'Artículo no disponible'}</h2>
        <p className="text-zinc-500 text-xs mb-6">El producto que buscás no existe o no se encuentra disponible actualmente.</p>
        <Link to="/catalogo">
          <Button variant="primary">Explorar catálogo</Button>
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Enlace para volver */}
      <Link 
        to="/catalogo" 
        className="inline-flex items-center text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        <FiArrowLeft className="mr-1.5" /> 
        <span>Volver al catálogo</span>
      </Link>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Columna Izquierda: Galería e Imagen Principal */}
        <div className="lg:col-span-6 mb-10 lg:mb-0">
          <div className="aspect-square w-full rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center relative">
            {imageUrl && !imgError ? (
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover" 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                <FiShoppingBag className="text-5xl mb-3 text-zinc-300" />
                <span className="font-semibold text-lg text-zinc-800">
                  {product.name}
                </span>
                {product.winery && (
                  <span className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
                    {product.winery}
                  </span>
                )}
              </div>
            )}

            {product.type && (
              <div className="absolute top-4 left-4">
                <Badge variant="neutral">{product.type}</Badge>
              </div>
            )}
          </div>

          {/* Garantías de compra debajo de la imagen */}
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-zinc-600">
            <div className="flex items-center gap-2 p-3 rounded-md bg-zinc-50 border border-zinc-200">
              <FiShield className="text-zinc-800 text-sm flex-shrink-0" />
              <span>Garantía de calidad oficial</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-md bg-zinc-50 border border-zinc-200">
              <FiTruck className="text-zinc-800 text-sm flex-shrink-0" />
              <span>Embalaje técnico seguro</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Ficha de Compra e Información */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-zinc-200">
            {product.winery && (
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-1.5">
                {product.winery}
              </p>
            )}
            
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mb-3 leading-snug">
              {product.name}
            </h1>
            
            {/* Precio y Disponibilidad */}
            <div className="flex items-baseline justify-between py-4 my-3 border-y border-zinc-100">
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  {themeConfig.brand.currencySymbol}{priceFormatted}
                </span>
              </div>

              <div>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>En stock ({product.stock} un.)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded">
                    Sin stock disponible
                  </span>
                )}
              </div>
            </div>

            {/* Beneficio de precio por transferencia */}
            {product.transferPrice && (
              <div className="mb-6 p-3 rounded-md bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-zinc-900">Precio con transferencia:</p>
                  <p className="text-zinc-500">Descuento aplicado en el pago</p>
                </div>
                <span className="text-base font-bold text-emerald-700">
                  {themeConfig.brand.currencySymbol}{Number(product.transferPrice).toLocaleString('es-AR')}
                </span>
              </div>
            )}

            {/* Ficha técnica compacta */}
            {(product.varietal || product.year || product.region) && (
              <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-md bg-zinc-50 border border-zinc-100 text-center text-xs">
                {product.varietal && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Varietal</span>
                    <strong className="text-zinc-800 font-medium">{product.varietal}</strong>
                  </div>
                )}
                {product.year && (
                  <div className="border-x border-zinc-200">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Añada</span>
                    <strong className="text-zinc-800 font-medium">{product.year}</strong>
                  </div>
                )}
                {product.region && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Región / Origen</span>
                    <strong className="text-zinc-800 font-medium">{product.region}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Descripción */}
            <div className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              <p>{product.description || 'Etiqueta elaborada con uvas seleccionadas y crianza cuidada para expresar la calidad de su origen.'}</p>
            </div>

            {/* Selector de cantidad y CTA principal */}
            {product.stock > 0 && (
              <div className="space-y-3 pt-3 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  {/* Stepper de cantidad */}
                  <div className="inline-flex items-center border border-zinc-200 rounded-md bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <FiMinus size={13} />
                    </button>
                    <span className="px-4 text-xs font-semibold text-zinc-900 select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-30 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <FiPlus size={13} />
                    </button>
                  </div>

                  {/* Botón principal */}
                  <div className="flex-1">
                    <Button fullWidth size="lg" onClick={handleAdd} className="text-xs sm:text-sm">
                      <FiShoppingBag className="mr-2" />
                      <span>Agregar al carrito</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Acordeón / Secciones de Información Adicional */}
          <div className="mt-6 border border-zinc-200 rounded-lg overflow-hidden bg-white divide-y divide-zinc-200">
            {product.tastingNotes && (
              <div>
                <button
                  type="button"
                  onClick={() => setOpenTab(openTab === 'notes' ? '' : 'notes')}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
                  <span>Notas de Cata</span>
                  {openTab === 'notes' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                </button>
                {openTab === 'notes' && (
                  <div className="px-5 pb-4 text-xs text-zinc-600 leading-relaxed">
                    {product.tastingNotes}
                  </div>
                )}
              </div>
            )}

            {product.pairing && (
              <div>
                <button
                  type="button"
                  onClick={() => setOpenTab(openTab === 'care' ? '' : 'care')}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
                  <span>Maridaje Sugerido</span>
                  {openTab === 'care' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                </button>
                {openTab === 'care' && (
                  <div className="px-5 pb-4 text-xs text-zinc-600 leading-relaxed">
                    {product.pairing}
                  </div>
                )}
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={() => setOpenTab(openTab === 'shipping' ? '' : 'shipping')}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                <span>Envíos y Embalaje Seguro</span>
                {openTab === 'shipping' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
              </button>
              {openTab === 'shipping' && (
                <div className="px-5 pb-4 text-xs text-zinc-600 leading-relaxed space-y-1">
                  <p>• Despachamos en cajas reforzadas con embalaje seguro para proteger cada botella.</p>
                  <p>• Pedido mínimo de despacho: {themeConfig.brand.minOrderUnits || 6} botellas.</p>
                  <p>• Los costos de envío y el seguimiento se coordinan de forma personalizada por WhatsApp al confirmar la orden.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;