import { CategorySelector, CategoryOption } from "./CategorySelector";
import { ProductGrid } from "./ProductGrid";
import { SortOptions } from "./SortOptions";
import { ProductType, ProductsResponse } from "../types/productsType";

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
}: RestaurantLandingProps) => {

  const handleViewDetails = (product: ProductType) => {
    console.debug("handleViewDetails restaurant", product.id);
  };


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
          />
        </div>
      </main>
    </div>
  );
};
