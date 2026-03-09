import { CategorySelector, CategoryOption } from "./CategorySelector";
import { ProductGrid } from "./ProductGrid";
import { SortOptions } from "./SortOptions";
import { CompanyType } from "../types/companyType";
import { ProductType, ProductsResponse } from "../types/productsType";
import { useState } from "react";
import { ProductDetail } from "./ProductDetail";

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

/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [highlightedIdx, setHighlightedIdx] = useState<number | null>(null);

  const handleViewDetails = (product: ProductType) => {
    console.debug("handleViewDetails called", product.id);
    setSelectedProduct(product);
  };

  const handleMockClick = (
    prod: typeof mockMasVendidos[number],
    idx: number
  ) => {
    console.debug("mock clicked", prod.name, idx);
    // briefly highlight
    setHighlightedIdx(idx);
    setTimeout(() => setHighlightedIdx(null), 200);

    // build ProductType
    const priceNum = Number(prod.price.replace(/[.\s]/g, ""));
    const p: ProductType = {
      id: 10000 + idx,
      productName: prod.name,
      price: isNaN(priceNum) ? 0 : priceNum,
      categoryId: 0,
      category: prod.store,
      image: prod.img,
      comments: [],
    };
    handleViewDetails(p);
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

  // helper to pick readable text color against primaryColor background
  const getContrastColor = (hex: string) => {
    let h = hex.replace("#", "");
    if (h.length === 3) {
      h = h.split("").map((c) => c + c).join("");
    }
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  const mockHeroBanners = [
    "https://multi-catalogo.encatalogo.com/./imagenes_banners/pantalones.png",
    "https://multi-catalogo.encatalogo.com/./imagenes_banners/banneeer%202.png",
    "https://multi-catalogo.encatalogo.com/./imagenes_banners/Porta%20ferraclick.png",
    "http://multi-catalogo.encatalogo.com/./imagenes_banners/1.png"
  ];

  const mockStoreBanners = [
    { img: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/Carrusel_01-1800x500.jpg", link: "#" },
    { img: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/c16f1790-4bf7-4449-bf22-7dd87b0916ba___02546700710ad6b9fbe78a688c0b9b0c.webp", link: "#" },
    { img: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/3%20(1).png", link: "#" },
    { img: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/banneeer%20(1).png", link: "#" },
  ];

  const mockTiendas = [
    { id: "3", name: "Fitness Gym", location: "Mariano moreno 1837", category: "Entrenamiento", bgImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/1.png", logo: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/descarga%20(2).png" },
    { id: "1", name: "Indumentaria", location: "Mariano moreno 1837", category: "Indumentaria", bgImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/banneeer%20(1).png", logo: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/logo.f09ef3c6cf9fdd7660e0.png" },
    { id: "5", name: "Tecnologia", location: "SALTA CAPITAL", category: "Tecnologia", bgImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/3%20(1).png", logo: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/descarga%20(3).png" },
    { id: "2", name: "Bolsos Rey", location: "SALTA CAPITAL", category: "Moda", bgImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/c16f1790-4bf7-4449-bf22-7dd87b0916ba___02546700710ad6b9fbe78a688c0b9b0c.webp", logo: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/bag-logo-premium-quality-handbag-600nw-2418460513.webp" },
    { id: "4", name: "Energy gym", location: "SALTA CAPITAL", category: "Gym", bgImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/Carrusel_01-1800x500.jpg", logo: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/attachment_97489210.jpeg" }
  ];

  const mockMasVendidos = [
    { name: "SKY NEGRA", price: "20.000.00", oldPrice: "22.000.00", store: "Indumentaria", storeImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/logo.f09ef3c6cf9fdd7660e0.png", img: "http://multi-catalogo.encatalogo.com/./imagenes_productos/IMG_8716.jpeg" },
    { name: "CREATINA 250 GRS GENTECH", price: "4.500.00", oldPrice: "6.000.00", store: "Energy gym", storeImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/attachment_97489210.jpeg", img: "http://multi-catalogo.encatalogo.com/./imagenes_productos/diapositiva11-767d5a66a6d886aae316959182208642-640-0.webp" },
    { name: "MANCUERNAS REGULABLES", price: "2.300.00", oldPrice: null, store: "Energy gym", storeImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/attachment_97489210.jpeg", img: "http://multi-catalogo.encatalogo.com/./imagenes_productos/mancu-ajustable-51-c65d084471c0ba7d5d16511803045177-640-0.webp" },
    { name: "Zapatillas de Entrenamiento para Hombre", price: "4.400.00", oldPrice: null, store: "Fitness Gym", storeImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/descarga%20(2).png", img: "http://multi-catalogo.encatalogo.com/./imagenes_productos/810070-800-800.webp" },
    { name: "CORE BAG PROYEC", price: "3.400.00", oldPrice: "9.000.00", store: "Energy gym", storeImg: "http://multi-catalogo.encatalogo.com/./imagenes_tiendas/attachment_97489210.jpeg", img: "http://multi-catalogo.encatalogo.com/./imagenes_productos/core-bag1-a19734d6d22ca217bb16452775608630-640-0.webp" },
  ];

  return (
    <div className="w-full bg-gray-50 pb-20 md:pb-10 font-sans">
      <main className="space-y-6 flex flex-col items-center w-full">

        {/* Full Width Hero Banners Slider */}
        <section className="w-full">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {mockHeroBanners.map((src, i) => (
              <img key={i} src={src} className="w-full h-48 sm:h-64 object-cover snap-center flex-shrink-0" alt={`Banner ${i}`} />
            ))}
          </div>
        </section>

        {/* Store Banners Horizontal Slider */}
        <section className="w-full -mt-2">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-3 px-4 py-2">
            {mockStoreBanners.map((src, i) => (
              <img key={i} src={src.img} className="w-[85%] sm:w-[60%] h-32 sm:h-48 object-cover rounded-[15px] snap-center flex-shrink-0 shadow-sm" alt={`Store Banner ${i}`} />
            ))}
          </div>
        </section>

        {/* Mock Tiendas Destacadas */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="flex overflow-x-auto gap-2 hide-scrollbar mb-4 border-b border-gray-200">
            <button className="px-5 py-2 text-sm font-semibold border-b-2 whitespace-nowrap" style={{ borderColor: primaryColor, color: primaryColor }}>Tiendas</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Indumentaria</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Moda</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Entrenamiento</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Gym</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Tecnologia</button>
          </div>

          <div className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar pb-6 snap-x snap-mandatory">
            {mockTiendas.map(tienda => (
              <div key={tienda.id} className="flex-shrink-0 w-64 snap-start rounded-[20px] overflow-hidden bg-white shadow-md border border-gray-100 flex flex-col transition">
                <div className="h-32 w-full relative bg-gray-100">
                  <img src={tienda.bgImg} className="w-full h-full object-cover" alt={tienda.name} />
                </div>
                <div className="p-3 bg-white flex items-center gap-3 relative -mt-8">
                  <div className="h-14 w-14 rounded-full border-2 border-white bg-white flex items-center justify-center overflow-hidden shadow-sm z-10 shrink-0">
                    <img src={tienda.logo} className="h-10 w-10 object-contain" alt={tienda.name} />
                  </div>
                  <div className="text-left flex-1 mt-6">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase">{tienda.category}</p>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">{tienda.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{tienda.location}</p>
                  </div>
                  <div className="mt-8 text-indigo-100 bg-blue-500 rounded p-1" style={{ backgroundColor: primaryColor }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mock Más vendido / Products */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-2 hide-scrollbar mb-4 border-b border-gray-200">
            <button className="px-5 py-2 text-sm font-semibold border-b-2 whitespace-nowrap" style={{ borderColor: primaryColor, color: primaryColor }}>Más vendido</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Zapatillas</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Remeras</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Bolsos</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Mochilas</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-500 whitespace-nowrap">Medias</button>
          </div>

          <div className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar pb-6 snap-x snap-mandatory">
            {mockMasVendidos.map((prod, i) => (
              <div
                key={i}
                onClick={() => handleMockClick(prod, i)}
                className={`flex-shrink-0 w-44 snap-start rounded-[16px] overflow-hidden bg-white shadow-md border flex flex-col relative transition cursor-pointer ${
                  highlightedIdx === i ? "border-2" : "border-gray-100"
                }`}
                style={
                  highlightedIdx === i
                    ? {
                        borderColor:
                          getContrastColor(primaryColor) === "black"
                            ? "black"
                            : "white",
                      }
                    : undefined
                }
              >
                <span
                  className="absolute top-2 left-2 text-[9px] px-2 py-[2px] rounded z-10 font-bold uppercase"
                  style={{
                    backgroundColor: primaryColor,
                    color: getContrastColor(primaryColor),
                  }}
                >Más Vendido</span>
                <div className="h-44 w-full bg-gray-50 overflow-hidden relative">
                  <img src={prod.img} className="w-full h-full object-cover" alt={prod.name} />
                </div>
                <div className="p-3 bg-white flex flex-col items-center text-center">
                  <h4 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 h-10">{prod.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-md font-extrabold text-black">${prod.price}</span>
                    {prod.oldPrice && <span className="text-[10px] text-gray-400 line-through">${prod.oldPrice}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 w-full justify-center">
                    <img src={prod.storeImg} className="w-5 h-5 object-contain rounded-full border border-gray-200" alt={prod.store} />
                    <span className="text-[11px] text-gray-500 font-medium">{prod.store}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider before real data */}
        <div className="w-full h-2 bg-gray-200 my-4" />

        {/* Default implementation showing catalog data obtained from services */}
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
              <h2 className="text-xl font-bold text-gray-900">Nuevos Productos</h2>
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
              />
              {products.length === 0 ? (
                <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm border border-gray-100">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M8 16l-4-4 4-4" />
                  </svg>
                  No hay productos disponibles para esta selección actualmente.
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
