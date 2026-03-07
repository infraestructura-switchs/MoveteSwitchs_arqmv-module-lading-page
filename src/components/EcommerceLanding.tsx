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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <main className="space-y-14">
        <section className="relative overflow-hidden rounded-[32px] bg-white shadow-md p-6 sm:p-10 flex flex-col lg:flex-row gap-10 items-center">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(circle at top, ${primaryColor}22 0%, transparent 60%)`,
            }}
          />
          <div className="relative flex-1 space-y-4">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: `${primaryColor}20`,
                color: primaryColor,
              }}
            >
              Nuevas colecciones disponibles
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {companyDisplayName}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Descubre un catálogo pensado para destacar tu estilo. Explora
              prendas y calzado con una experiencia rápida y sencilla.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#catalogo"
                className="px-5 py-2.5 rounded-full text-white font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: primaryColor }}
              >
                Ver catálogo
              </a>
              <button
                className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-semibold transition hover:border-gray-400 hover:text-gray-900"
                onClick={onOpenCart}
              >
                Ver carrito
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/3] rounded-3xl bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={companyDisplayName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center px-6">
                  <p className="text-gray-500 text-sm">Colección destacada</p>
                  <p className="text-gray-800 font-semibold text-lg">
                    {companyDisplayName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {featuredCategories.length > 0 ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Categorías destacadas
              </h2>
              <span className="text-sm text-gray-500">
                Explora lo más buscado de la tienda
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {featuredCategories.map((category) => (
                <button
                  key={category.value}
                  className="rounded-2xl bg-white border border-gray-100 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => onSelectFeaturedCategory(category.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-gray-100 flex items-center justify-center">
                      <img
                        src={category.img}
                        alt={category.label}
                        className="h-6 w-6"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {category.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.count} productos
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-slate-200">
              Colección de temporada
            </p>
            <h3 className="text-2xl font-semibold">
              Combina estilo y comodidad en cada prenda
            </h3>
            <p className="text-sm text-slate-200">
              Compra con confianza y recibe recomendaciones pensadas para ti.
            </p>
          </div>
          <button
            className="px-5 py-2.5 rounded-full text-white font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: primaryColor }}
            onClick={onOpenCart}
          >
            Comprar ahora
          </button>
        </section>

        <section id="catalogo" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Catálogo digital
              </h2>
              <p className="text-sm text-gray-600">
                Filtra, ordena y encuentra tu próximo favorito.
              </p>
            </div>
            <div className="min-w-[200px] rounded-2xl bg-white shadow-sm p-2">
              <SortOptions value={sortOption} onChange={onSortChange} />
            </div>
          </div>

          <CategorySelector
            options={categoryOptions}
            active={activeCategory}
            onSelect={onSelectCategory}
          />

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
              <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
                No hay productos disponibles para esta selección.
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefitItems.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h4>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};
