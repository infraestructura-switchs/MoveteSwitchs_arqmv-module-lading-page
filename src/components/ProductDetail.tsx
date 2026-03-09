import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { ProductType } from "../types/productsType";

export type ProductDetailProps = {
  product: ProductType;
  onBack: () => void;
  onAddToCart: (product: ProductType, quantity: number, comment: string) => void;
};

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);

  // animate in when mounted
  useEffect(() => {
    // delay to allow transition
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleAdd = () => {
    onAddToCart(product, quantity, comment);
  };

  // when back requested, animate out first
  const handleBackClick = () => {
    setVisible(false);
    // after animation completes call onBack
    setTimeout(() => {
      onBack();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-white z-50 overflow-auto transition-transform transition-opacity duration-300 ease-in-out transform ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
    >
      {/* header with back button */}
      <div className="p-4 flex items-center border-b border-gray-200">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="ml-2">Volver</span>
        </button>
      </div>
      {/* content */}
      <div className="p-4 space-y-6">
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.productName}
            className="max-h-full object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {product.productName}
        </h1>
        <div className="text-xl font-extrabold text-black">
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          }).format(product.price)}
        </div>
        <p className="text-gray-700 whitespace-pre-line">
          {product.description || "No hay descripción disponible."}
        </p>

        {/* quantity selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            +
          </button>
        </div>
        <textarea
          placeholder="Comentario (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          rows={3}
        />
        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};
