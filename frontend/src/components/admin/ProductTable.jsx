import React from 'react';
import Badge from '../ui/Badge';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div>
      {/* Mobile Card List (screens < 768px) */}
      <div className="md:hidden space-y-3">
        {products.map(product => {
          const productId = product.id || product._id;
          const priceFormatted = Number(product.price).toLocaleString('es-AR');
          const typeKey = (product.type || 'TINTO').toUpperCase();
          const imageUrl = product.imageUrl || product.image;

          return (
            <div key={productId} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-start space-x-3">
                <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-lg border overflow-hidden flex items-center justify-center text-2xl">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="" 
                      className="h-full w-full object-cover" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span>🍷</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Badge variant={typeKey.toLowerCase()}>{product.type}</Badge>
                    <span className="text-xs text-gray-500">{product.year}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 truncate mt-1">{product.name}</h4>
                  <p className="text-xs text-gold font-medium">{product.winery}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.varietal}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 mr-1">$</span>
                  <span className="text-lg font-bold text-wine">{priceFormatted}</span>
                  <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${product.stock > 5 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock} un.
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(product)}
                    className="p-2 bg-gray-100 hover:bg-wine/10 text-wine rounded-lg transition-colors"
                    title="Editar"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button 
                    onClick={() => { if(window.confirm(`¿Eliminar ${product.name}?`)) onDelete(productId); }}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (screens >= 768px) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-xs border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo / Varietal</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => {
              const productId = product.id || product._id;
              const priceFormatted = Number(product.price).toLocaleString('es-AR');
              const typeKey = (product.type || 'TINTO').toUpperCase();
              const imageUrl = product.imageUrl || product.image;

              return (
                <tr key={productId} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg border overflow-hidden flex items-center justify-center text-lg">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt="" 
                            className="h-10 w-10 object-cover" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span>🍷</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.winery} {product.year ? `(${product.year})` : ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 mb-1">{product.varietal}</div>
                    <Badge variant={typeKey.toLowerCase()}>{product.type}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-wine">
                    ${priceFormatted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 5 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock} un.
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onEdit(product)} 
                      className="text-wine hover:text-wine/80 mr-4 transition-colors" 
                      title="Editar"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button 
                      onClick={() => { if(window.confirm(`¿Eliminar ${product.name}?`)) onDelete(productId); }} 
                      className="text-red-600 hover:text-red-900 transition-colors" 
                      title="Eliminar"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
