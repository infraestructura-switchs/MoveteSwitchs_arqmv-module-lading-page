import { CategorySelector, CategoryOption } from "./CategorySelector";
import { ProductGrid } from "./ProductGrid";
import { SortOptions } from "./SortOptions";
import { CompanyType } from "../types/companyType";
import { ProductType, ProductsResponse } from "../types/productsType";

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
  activeCategory: string;
  onSelectCategory: (value: string) => void;
  onSelectFeaturedCategory: (value: string) => void;
  products: ProductType[];
  allProducts: ProductsResponse | null;
  onAddToCart: (product: ProductType, qty: number, comment: string) => void;
  primaryColor: string;
  searchTerm: string;
  onOpenCart: () => void;
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
}: EcommerceLandingProps) => {
  return (
    <div className="w-full bg-gray-50 pb-20 md:pb-10 font-sans">
      <main className="space-y-8 flex flex-col items-center">
        {/* Banner Hero Section */}
        <section className="w-full relative bg-white shadow-sm flex flex-col items-center">
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-100 flex items-center justify-center overflow-hidden">
            {config.logoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700">
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{ backgroundColor: primaryColor }}
                />
                <img
                  src={config.logoUrl}
                  alt={companyDisplayName}
                  className="max-h-full max-w-full object-contain drop-shadow-2xl z-10 p-4"
                />
              </div>
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                  {companyDisplayName}
                </h1>
                <p className="mt-2 text-sm opacity-90">Explora nuestro catálogo digital</p>
              </div>
            )}
          </div>
        </section>

        {/* Tiendas / Featured Categories */}
        {featuredCategories.length > 0 ? (
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-4">
            <h2 className="text-lg font-bold items-center mb-3">Tiendas Destacadas</h2>
            <div className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar pb-4 snap-x">
              {featuredCategories.map((category) => (
                <button
                  key={category.value}
                  className="flex-shrink-0 w-64 snap-start rounded-xl overflow-hidden bg-white shadow-md border border-gray-100 flex flex-col transition hover:opacity-90 active:scale-95"
                  onClick={() => onSelectFeaturedCategory(category.value)}
                >
                  <div className="h-24 w-full bg-gray-200 overflow-hidden relative">
                    <img
                      src={category.img}
                      alt={category.label}
                      className="w-full h-full object-cover blur-[2px] opacity-80"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20" />
                  </div>
                  <div className="p-3 flex items-center gap-3 relative -mt-6">
                    <div className="h-12 w-12 rounded-full border-2 border-white bg-white flex items-center justify-center overflow-hidden shadow-sm z-10 shrink-0">
                      <img src={category.img} alt={category.label} className="h-8 w-8 object-contain" />
                    </div>
                    <div className="text-left flex-1 mt-6">
                      <p className="text-xs font-semibold text-gray-500 uppercase">{category.label}</p>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight truncate">{companyDisplayName}</h4>
                    </div>
                    <div className="mt-6 text-gray-400">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section id="catalogo" className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <CategorySelector
                options={categoryOptions}
                active={activeCategory}
                onSelect={onSelectCategory}
                primaryColor={primaryColor}
              />
            </div>

            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-900">Catálogo digital</h2>
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
              />
              {products.length === 0 ? (
                <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm border border-gray-100">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M8 16l-4-4 4-4" />
                  </svg>
                  No hay productos disponibles para esta selección.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Mobile App-like Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 sm:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-900 pointer-events-auto">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[10px] font-medium mt-1">Inicio</span>
          </button>
          <a href={`https://wa.me/?text=Hola`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center w-full h-full text-green-500 pointer-events-auto">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.25.309 2.455.918 3.541l-.816 2.978 3.047-.8c1.053.565 2.251.871 3.483.871 3.181 0 5.767-2.585 5.769-5.767A5.766 5.766 0 0012.031 6.172zM12.03 16.969h-.005a4.706 4.706 0 01-2.433-.674l-.174-.103-1.81.474.482-1.764-.113-.18a4.72 4.72 0 01-.723-2.522c0-2.607 2.122-4.73 4.73-4.73 1.264 0 2.45.492 3.344 1.385 1.776 1.777 1.772 4.88-.009 6.643-1.775 1.765-4.881 1.762-6.645-.018l-.001-.001zM14.63 13.565c-.144-.072-.843-.416-.974-.464-.131-.048-.225-.072-.32.072-.095.144-.367.464-.449.56-.083.096-.166.108-.31.036-.144-.072-.601-.222-1.146-.708-.423-.377-.709-.843-.792-.987-.083-.144-.009-.222.063-.294.065-.065.144-.168.216-.252.072-.084.095-.144.144-.24.048-.096.024-.18-.012-.252-.036-.072-.32-.771-.439-1.056-.115-.278-.233-.241-.32-.245-.083-.004-.179-.004-.275-.004-.096 0-.251.036-.381.18-.131.144-.499.488-.499 1.188s.511 1.38.583 1.476c.072.096 1.008 1.536 2.44 2.16.342.148.608.236.815.302.343.109.655.093.902.056.275-.041.843-.344.962-.676.119-.332.119-.616.083-.676-.036-.06-.131-.096-.275-.168z" /></svg>
            <span className="text-[10px] font-medium mt-1">WhatsApp</span>
          </button>
          <button onClick={onOpenCart} className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-900 pointer-events-auto relative">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="text-[10px] font-medium mt-1">Carrito</span>
          </button>
        </div>

      </main>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
