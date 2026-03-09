import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ProductType } from "../types/productsType";
import ProductModal from "./ProductModal";

interface ProductCardProps {
  product: ProductType;
  onAddToCart: (product: ProductType, quantity: number, comment: string) => void;
  primaryColor: string;
  /** optional handler when the card is clicked to view details */
  onViewDetails?: (product: ProductType) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  primaryColor,
  onViewDetails,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCardClick = () => {
    console.debug("ProductCard clicked", product.id);
    // flash highlight
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 300);
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => (document.body.style.cursor = "pointer")}
      onMouseLeave={() => (document.body.style.cursor = "")}
      className={`flex items-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border p-3 sm:p-4 min-h-[120px] cursor-pointer ${
        justClicked ? `border-2` : "border-gray-100"
      }`}
      style={justClicked ? { borderColor: primaryColor } : undefined}
    >
      <img
        src={product.image}
        alt={product.productName}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0 cursor-pointer"
        loading="lazy"
      />

      <div className="flex flex-col flex-1 ml-3 sm:ml-4 min-w-0 cursor-pointer">
        <div className="flex items-start justify-between gap-3 cursor-pointer">
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate ${
                justClicked ? "bg-yellow-100" : "text-gray-800"
              }`}>
              {product.productName}
            </h3>
            <span className={`text-base sm:text-lg font-bold ${
                justClicked ? "text-blue-600" : "text-black"
              }`}>
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              }).format(product.price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal();
            }}
            className="ml-2 flex items-center justify-center rounded-full border-2 border-[#db3434] text-[#db3434] hover:bg-[#ffe5d0] transition-colors w-10 h-10 sm:w-9 sm:h-9"
            aria-label="Agregar"
            title="Agregar"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <p
          className="text-gray-500 text-xs sm:text-sm mt-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,         // 2 líneas en móvil/desktop sin plugin
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={product.description || ""}
        >
          {product.description ||
            "300g de carne Angus, lechuga, tomate, cebolla, salsa de la casa y tocineta. Acompañado de papas a la francesa."}
        </p>
      </div>

      {isModalOpen && (
        <ProductModal
          product={product}
          onClose={handleCloseModal}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};
