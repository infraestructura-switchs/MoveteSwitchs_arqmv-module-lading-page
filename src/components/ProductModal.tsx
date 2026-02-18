import React, { useState } from "react";
import { ProductType } from "../types/productsType";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { ArrowLeft } from "lucide-react";

interface ProductModalProps {
  product: ProductType;
  onClose: () => void;
  onAddToCart: (product: ProductType, quantity: number, comments: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [customComments, setCustomComments] = useState("");

  const handleCheckboxChange = (comment: string) => {
    setSelectedComments((prev) =>
      prev.includes(comment)
        ? prev.filter((c) => c !== comment)
        : [...prev, comment]
    );
  };

  const handleAddToCart = () => {
    const allComments = [
      ...selectedComments,
      customComments.trim() ? customComments.trim() : ""
    ].filter(Boolean).join(", ");
    onAddToCart(product, quantity, allComments);
    onClose();
  };

  const preparationTime = product.preparationTime ?? 30;  

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-[90vw] sm:w-[500px] max-w-[95vw] relative"> 
        <button onClick={onClose} className="absolute top-2 left-2 text-2xl text-red-600"> 
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="flex justify-center mb-4"> 
          <img
            src={product.image}
            alt={product.productName}
            className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-lg"
          />
        </div>

        <div className="mb-2"> 
          <h2 className="text-sm font-semibold text-black">{product.productName}</h2>
          <p className="text-xl font-bold text-black">{new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          }).format(product.price)}</p>
        </div>

        <p className="text-sm text-gray-600 mb-4">{product.description || "300g de carne Angus, lechuga, tomate, cebolla, salsa de la casa y tocineta. Acompañado de papas a la francesa."}</p>

        <div className="flex justify-center text-xs text-gray-600 mb-3"> 
          <span>Tiempo de preparación: </span>
          <img src="/assets/icons/sarten.png" alt="Sartén" className="h-4 w-4 mx-1 inline-block" />
          <span className="font-bold text-sm">{preparationTime} min. </span>
          <span className="ml-2">Aprox.</span>
        </div>

        {product.comments && product.comments.length > 0 && (
          <div className="mb-2"> 
            <label className="block text-sm font-bold text-black mb-1">
              Opciones disponibles
            </label>
            <div className="max-h-32 overflow-y-auto"> 
              {product.comments.map((comment, index) => (
                <div key={index} className="flex items-center mb-1"> 
                  <input
                    type="checkbox"
                    id={`comment-${index}`}
                    checked={selectedComments.includes(comment)}
                    onChange={() => handleCheckboxChange(comment)}
                    className="mr-2"
                  />
                  <label htmlFor={`comment-${index}`} className="text-sm text-gray-600">
                    {comment}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-2"> 
          <label htmlFor="comments" className="block text-sm font-bold text-black mb-1">
            Personaliza tu orden
          </label>
          <textarea
            id="comments"
            value={customComments}
            onChange={(e) => setCustomComments(e.target.value)}
            className="border p-2 w-full mb-2 bg-gray-200 rounded-lg placeholder:text-sm resize-none" 
            rows={2} 
            placeholder="Ejemplo: Sin cebolla, extra salsa"
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 rounded-full bg-red-500 text-white"
              disabled={quantity <= 1}
            >
              <AiOutlineMinus className="h-4 w-4" />
            </button>
            <span className="text-lg font-semibold mx-4">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 rounded-full bg-red-500 text-white mr-2"
            >
              <AiOutlinePlus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-red-600 text-white py-2 px-4 rounded-full flex-1"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;