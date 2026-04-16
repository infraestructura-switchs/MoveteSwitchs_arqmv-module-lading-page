import { CategorySelector, CategoryOption } from "./CategorySelector";
import { ProductGrid } from "./ProductGrid";
import { SortOptions } from "./SortOptions";
import { ProductType, ProductsResponse } from "../types/productsType";
import ProductModal from "./ProductModal";
import { useState } from "react";
import PaginationControls from "./PaginationControls";

export type RestaurantLandingProps = {
  categoryOptions: CategoryOption[];
  activeCategory: string;
  onSelectCategory: (value: string) => void;
  sortOption: "" | "priceLowToHigh" | "priceHighToLow";
  onSortChange: (value: "" | "priceLowToHigh" | "priceHighToLow") => void;
  products: ProductType[];
  allProducts: ProductsResponse | null;
  onAddToCart: (product: ProductType, qty: number, comment: string) => void;
  primaryColor: string;
  searchTerm: string;
  onOpenCart?: () => void;
  onDirectConfirm?: () => void;
  cartCount?: number;
  isPagedMode?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (nextPage: number) => void;
};

export const RestaurantLanding = ({
  categoryOptions,
  activeCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  products,
  allProducts,
  onAddToCart,
  primaryColor,
  searchTerm,
  onOpenCart,
  onDirectConfirm,
  cartCount,
  isPagedMode = false,
  page = 0,
  totalPages = 0,
  onPageChange,
}: RestaurantLandingProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const handleViewDetails = (product: ProductType) => {
    console.debug("handleViewDetails restaurant", product.id);
    setSelectedProduct(product);
  };

  const handleCloseModal = () => setSelectedProduct(null);


  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
      <main>
        <CategorySelector
          options={categoryOptions}
          active={activeCategory}
          onSelect={onSelectCategory}
        />

        <SortOptions value={sortOption} onChange={onSortChange} />

        <div className="mb-8">
          <ProductGrid
            activeCategory={activeCategory}
            searchTerm={searchTerm}
            sortOption={sortOption}
            products={products}
            allProducts={allProducts}
            categoryOptions={categoryOptions}
            onAddToCart={onAddToCart}
            primaryColor={primaryColor}
            onViewDetails={handleViewDetails}
            onOpenCart={onOpenCart}
            onDirectConfirm={onDirectConfirm}
            cartCount={cartCount}
            forceFlatMode={isPagedMode}
          />

          {isPagedMode && onPageChange ? (
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          ) : null}
        </div>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={handleCloseModal}
            onAddToCart={onAddToCart}
          />
        )}
      </main>
    </div>
  );
};
