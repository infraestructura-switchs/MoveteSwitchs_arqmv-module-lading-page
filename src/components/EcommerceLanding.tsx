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
            {/* WhatsApp Icon */}
            <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M12.012 2c5.506 0 9.989 4.478 9.99 9.984a9.964 9.964 0 01-2.923 7.067l.006-.008L20.5 22l-2.986-1.402A9.957 9.957 0 0112 21.984C6.494 21.984 2 17.506 2 12S6.494 2 12.012 2zm.006 1.66A8.32 8.32 0 003.666 12a8.312 8.312 0 001.688 5.048l-1.01 2.91 2.984-.96a8.322 8.322 0 004.69 1.426 8.32 8.32 0 008.334-8.31c0-4.59-3.742-8.327-8.334-8.327zm4.27 10.38c.23.11.892.41 1.05.474.156.064.269.112.383.272.103.14.288.428.375.589.08.15.15.2.046.368-.11.16-.27.27-.61.442-.32.16-.76.32-1.39.278-.65-.04-1.29-.276-2.072-.64-1.04-.498-1.99-1.36-2.586-1.956-.057-.058-2.083-2.058-2.18-2.618-.086-.503-.02-1.043.204-1.4.156-.245.337-.4.512-.58.12-.116.32-.2.43-.32.096-.1.144-.06.223.1.134.27.464.912.51 1.01.046.1.1.26-.013.43-.105.152-.218.27-.336.4-.105.112-.236.257-.105.48.118.21.57.882 1.258 1.487.674.596 1.444.825 1.701.953.218.106.398.053.518-.06.12-.118.423-.464.55-.618.114-.144.24-.132.415-.068z" /></svg>
            <span className="text-[10px] font-medium mt-1">WhatsApp</span>
          </a>
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
