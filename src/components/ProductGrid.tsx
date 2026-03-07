import React from "react";
import { ProductType } from "../types/productsType";
import { CategoryOption } from "./CategorySelector";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  activeCategory: string;
  searchTerm: string;
  sortOption: "" | "priceLowToHigh" | "priceHighToLow";
  products: ProductType[];
  allProducts: Record<string, ProductType[]> | null;
  categoryOptions: CategoryOption[];
  onAddToCart: (product: ProductType, qty: number, comment: string) => void;
  primaryColor: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  activeCategory,
  searchTerm,
  sortOption,
  products,
  allProducts,
  categoryOptions,
  onAddToCart,
  primaryColor,
}) => {
  if (activeCategory === "all" && !searchTerm && !sortOption) {
    if (!allProducts) {
      return null;
    }

    return (
      <>
        {categoryOptions
          .filter((option) => option.value !== "all")
          .map(
            (option) =>
              allProducts[option.value]?.length > 0 && (
                <div key={option.value} className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {option.label}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 md:gap-6">
                    {allProducts[option.value].map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        primaryColor={primaryColor}
                      />
                    ))}
                  </div>
                </div>
              )
          )}
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 md:gap-6">
      {products.length > 0
        ? products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              primaryColor={primaryColor}
            />
          ))
        : null}
    </div>
  );
};
