import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface OrderSummaryProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  primaryColor: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  primaryColor
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (items.length === 0) return null;

  return (
    <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
      <h2 
        className="text-xl font-semibold mb-4 text-center text-white py-3 rounded-lg"
        style={{ backgroundColor: primaryColor }}
      >
        Resumen del Pedido
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 text-gray-700">Cantidad</th>
              <th className="text-left py-2 px-2 text-gray-700">Producto</th>
              <th className="text-right py-2 px-2 text-gray-700">Precio</th>
              <th className="text-right py-2 px-2 text-gray-700">Total</th>
              <th className="text-center py-2 px-2 text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.product.id} className="border-b border-gray-100 last:border-b-0">
                <td className="py-3 px-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-600"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-medium text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-600"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                
                <td className="py-3 px-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.productName}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.product.productName}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {item.product.description}
                      </p>
                    </div>
                  </div>
                </td>
                
                <td className="py-3 px-2 text-right text-gray-900">
                  {formatPrice(item.product.price)}
                </td>
                
                <td className="py-3 px-2 text-right font-semibold text-gray-900">
                  {formatPrice(item.product.price * item.quantity)}
                </td>
                
                <td className="py-3 px-2 text-center">
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-xl font-bold text-gray-900">
          <span>Total del Pedido:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};