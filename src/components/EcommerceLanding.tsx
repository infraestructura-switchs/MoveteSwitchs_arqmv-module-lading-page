import { CategorySelector, CategoryOption } from "./CategorySelector";
import { ProductGrid } from "./ProductGrid";
import { SortOptions } from "./SortOptions";
import { CompanyType } from "../types/companyType";
import { ProductType, ProductsResponse } from "../types/productsType";
import { useState } from "react";
import { ProductDetail } from "./ProductDetail";
import PaginationControls from "./PaginationControls";

export type FeaturedCategory = {
  value: string;
  label: string;
  img: string;
  count: number;
};

export type BenefitItem = {
  title: string;
  description: string;
};

export type EcommerceLandingProps = {
  config: CompanyType;
  companyDisplayName: string;
  featuredCategories: FeaturedCategory[];
  benefitItems: BenefitItem[];
  sortOption: "" | "priceLowToHigh" | "priceHighToLow";
  onSortChange: (value: "" | "priceLowToHigh" | "priceHighToLow") => void;
  categoryOptions: CategoryOption[];
  activeCategory: string | number;
  onSelectCategory: (value: string | number) => void;
  onSelectFeaturedCategory: (value: string | number) => void;
  products: ProductType[];
  allProducts: ProductsResponse | null;
  onAddToCart: (product: ProductType, qty: number, comment: string) => void;
  primaryColor: string;
  searchTerm: string;
  onOpenCart: () => void;
  onDirectConfirm?: () => void;
  cartCount?: number;
  isPagedMode?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (nextPage: number) => void;
};

export const EcommerceLanding = ({
  config,
  companyDisplayName,
  featuredCategories,
  benefitItems,
  sortOption,
  onSortChange,
  categoryOptions,
  activeCategory,
  onSelectCategory,
  onSelectFeaturedCategory,
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
}: EcommerceLandingProps) => {
  void config;
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const handleViewDetails = (product: ProductType) => {
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={handleBack}
        onAddToCart={onAddToCart}
      />
    );
  }

  const mockHeroBanners = [
    "https://multi-catalogo.encatalogo.com/./imagenes_banners/pantalones.png",
    "https://multi-catalogo.encatalogo.com/./imagenes_banners/banneeer%202.png",
    "https://multi-catalogo.encatalogo.com/./imagenes_banners/Porta%20ferraclick.png",
    "http://multi-catalogo.encatalogo.com/./imagenes_banners/1.png",
  ];

  const mockStoreBanners = [
    { img: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/Carrusel_01-1800x500.jpg", link: "#" },
    { img: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/c16f1790-4bf7-4449-bf22-7dd87b0916ba___02546700710ad6b9fbe78a688c0b9b0c.webp", link: "#" },
    { img: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/3%20(1).png", link: "#" },
    { img: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/banneeer%20(1).png", link: "#" },
  ];

  return (
    <div className="w-full bg-gray-50 pb-20 md:pb-10 font-sans">
      <main className="space-y-6 flex flex-col items-center w-full">
        <section className="w-full">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {mockHeroBanners.map((src, i) => (
              <img key={i} src={src} className="w-full h-48 sm:h-64 object-cover snap-center flex-shrink-0" alt={`Banner ${i}`} />
            ))}
          </div>
        </section>

        <section className="w-full -mt-2">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-3 px-4 py-2">
            {mockStoreBanners.map((item, i) => (
              <img key={i} src={item.img} className="w-[85%] sm:w-[60%] h-32 sm:h-48 object-cover rounded-[15px] snap-center flex-shrink-0 shadow-sm" alt={`Store Banner ${i}`} />
            ))}
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">{companyDisplayName}</h2>
            <span className="text-sm text-gray-500">{products.length} productos en esta pagina</span>
          </div>

          <div className="flex overflow-x-auto gap-3 hide-scrollbar pb-2">
            {featuredCategories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => onSelectFeaturedCategory(cat.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {benefitItems.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {benefitItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-xs text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <div className="w-full h-2 bg-gray-200 my-2" />

        <section id="catalogo" className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4">
            <CategorySelector
              options={categoryOptions}
              active={activeCategory}
              onSelect={onSelectCategory}
              primaryColor={primaryColor}
            />

            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-900">Catalogo</h2>
              <div className="min-w-[150px]">
                <SortOptions value={sortOption} onChange={onSortChange} />
              </div>
            </div>

            <div className="space-y-6">
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

              {products.length === 0 ? (
                <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm border border-gray-100">
                  No hay productos disponibles para esta seleccion actualmente.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
