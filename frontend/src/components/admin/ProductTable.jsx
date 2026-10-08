import React from 'react';
import Badge from '../ui/Badge';
import { FiEdit2, FiTrash2, FiBox } from 'react-icons/fi';
import themeConfig from '../../config/theme';

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
            <div key={productId} className="bg-white p-4 rounded-lg border border-zinc-200 shadow-soft flex flex-col justify-between">
              <div className="flex items-start space-x-3">
                <div className="h-14 w-14 flex-shrink-0 bg-zinc-100 rounded border border-zinc-200 overflow-hidden flex items-center justify-center text-zinc-400">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="" 
                      className="h-full w-full object-cover" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <FiBox size={18} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="neutral">{product.type}</Badge>
                    {product.year && <span className="text-[11px] text-zinc-400 font-normal">{product.year}</span>}
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900 truncate">{product.name}</h4>
                  {product.winery && <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">{product.winery}</p>}
                  {product.varietal && <p className="text-xs text-zinc-400">{product.varietal}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-zinc-100">
                <div>
                  <span className="text-sm font-bold text-zinc-900 tracking-tight">
                    {themeConfig.brand.currencySymbol}{priceFormatted}
                  </span>
                  <span className={`ml-2 text-[10px] font-semibold px-2 py-0.5 rounded ${product.stock > 5 ? 'bg-emerald-50 text-emerald-800' : product.stock > 0 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'}`}>
                    {product.stock} un.
                  </span>
                </div>

                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => onEdit(product)}
                    className="p-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded transition-colors border border-zinc-200"
                    title="Editar"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button 
                    onClick={() => { if(window.confirm(`¿Eliminar ${product.name}?`)) onDelete(productId); }}
                    className="p-1.5 bg-zinc-50 hover:bg-rose-50 text-rose-600 rounded transition-colors border border-zinc-200"
                    title="Eliminar"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (screens >= 768px) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Producto</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Categoría / Variante</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Precio</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-100">
            {products.map(product => {
              const productId = product.id || product._id;
              const priceFormatted = Number(product.price).toLocaleString('es-AR');
              const imageUrl = product.imageUrl || product.image;

              return (
                <tr key={productId} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-zinc-100 rounded border border-zinc-200 overflow-hidden flex items-center justify-center text-zinc-400">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt="" 
                            className="h-10 w-10 object-cover" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <FiBox size={16} />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-xs font-semibold text-zinc-900">{product.name}</div>
                        <div className="text-[11px] text-zinc-400">{product.winery || 'General'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-zinc-700 font-medium">{product.type}</span>
                    {product.varietal && <span className="text-[11px] text-zinc-400 block">{product.varietal}</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-zinc-900">
                    {themeConfig.brand.currencySymbol}{priceFormatted}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${product.stock > 5 ? 'bg-emerald-50 text-emerald-800' : product.stock > 0 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'}`}>
                      {product.stock} un.
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-zinc-500 hover:text-zinc-900 p-1"
                      title="Editar"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => { if(window.confirm(`¿Eliminar ${product.name}?`)) onDelete(productId); }}
                      className="text-zinc-400 hover:text-rose-600 p-1"
                      title="Eliminar"
                    >
                      <FiTrash2 size={14} />
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
