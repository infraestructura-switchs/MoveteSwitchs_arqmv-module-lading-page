import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ProductType } from "../types/productsType";
import ProductModal from "./ProductModal";

interface ProductCardProps {
  product: ProductType;
  onAddToCart: (product: ProductType, quantity: number, comment: string) => void;
  primaryColor: string;
  onViewDetails?: (product: ProductType) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  primaryColor,
  onViewDetails,
}) => {
  // debug: log price values to confirm API mapping
  // eslint-disable-next-line no-console
  console.debug('[ProductCard] id:', product.id, 'price:', product.price, 'originalPrice:', product.originalPrice);
  const [justClicked, setJustClicked] = useState(false);

  const handleCardClick = () => {
    console.debug("ProductCard clicked", product.id);
    setJustClicked(true);
    setTimeout(() => {
      setJustClicked(false);
      if (onViewDetails) {
        onViewDetails(product);
      }
    }, 200); 
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
            <h3 className="font-bold text-sm sm:text-base truncate text-gray-800">
              {product.productName}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-black">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(product.originalPrice)}
                  </span>
                  {(product.originalPrice > product.price || (product.discountAmount && product.discountAmount > 0)) && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                      -{
                        product.originalPrice > product.price
                          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                          : product.discountAmount && product.originalPrice && product.originalPrice > 0
                          ? Math.round((product.discountAmount / product.originalPrice) * 100)
                          : product.discountAmount && product.discountAmount > 0
                          ? Math.round(product.discountAmount)
                          : 0
                      }%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetails) onViewDetails(product);
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
            WebkitLineClamp: 2,      
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={product.description || ""}
        >
          {product.description ||
            "300g de carne Angus, lechuga, tomate, cebolla, salsa de la casa y tocineta. Acompañado de papas a la francesa."}
        </p>
      </div>

      {/* Modal handling delegated to parent via onViewDetails */}
    </div>
  );
};
