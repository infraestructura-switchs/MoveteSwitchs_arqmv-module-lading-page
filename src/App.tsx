import { useState, useEffect, useRef, useMemo } from "react";
import { Header } from "./components/Header";
import { Cart, CartRef } from "./components/Cart";
import LoadingScreen from "./components/LoadingScreen";
import { AdminPanel } from "./components/AdminPanel";
import { useLocalStorage } from "./hooks/useLocalStorage";
import pkg from "../package.json";
import { Category } from "./types";
import { CartItem, ProductType, ProductsResponse } from "./types/productsType";
import { CompanyType } from "./types/companyType";
import { useCompanyLocal } from "./hooks/useCompanyLocal";
import GenericScreen from "./components/GenericScreen";
import { EcommerceLanding, BenefitItem } from "./components/EcommerceLanding.tsx";
import { RestaurantLanding } from "./components/RestaurantLanding";
import { useCatalog } from "./hooks/useCatalog";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";

function App() {
  const {
    initialUrlParams,
    templateLanding,
    hasToken,
    authToken,
    companyId,
    isAuthResolved,
  } = useAuthBootstrap();

  const allProducts: ProductsResponse | null = null;
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("restaurant-cart", []);

  const { company } = useCompanyLocal();

  const bebidaImg = "/assets/icons/bebida.png";
  const combosImg = "/assets/icons/combos.png";
  const hamburguesaImg = "/assets/icons/hamburguesa.png";
  const papitasImg = "/assets/icons/papitas.png";
  const popularImg = "/assets/icons/popular.png";
  const todosImg = "/assets/icons/todos.png";

  const categoryImages = useMemo<Record<string, string>>(
    () => ({
      ALL: todosImg,
      HAMBURGUESAS: hamburguesaImg,
      DESGRANADOS: popularImg,
      PERROS: combosImg,
      CHUZOS: papitasImg,
      ALITAS: popularImg,
      CARNES: papitasImg,
      AREPAS: popularImg,
      GASEOSAS: bebidaImg,
      TOSTADAS: combosImg,
      COMBOS: papitasImg,
      MAIZITOS: combosImg,
      APLASTADOS: combosImg,
      SANDWICHES: combosImg,
      PAPAS: papitasImg,
      ADICIONES: papitasImg,
      "JUGOS AGUA": papitasImg,
      "JUGOS EN LECHE": papitasImg,
      "FRAPPE AGUA ": papitasImg,
      "FRAPPE EN LECHE": papitasImg,
      "JUGOS HIT": papitasImg,
      MALTEADAS: bebidaImg,
      "CONSUMO EMPLEADOS": papitasImg,
    }),
    [todosImg, hamburguesaImg, popularImg, combosImg, papitasImg, bebidaImg]
  );

  const {
    products,
    setProducts,
    searchTerm,
    setSearchTerm,
    sortOption,
    activeCategory,
    categoryOptions,
    visibleProducts,
    featuredCategories,
    page,
    totalPages,
    totalElements,
    isPagedMode,
    catalogLoading,
    handleSortChange,
    handleSelectCategory,
    handleSelectFeaturedCategory,
    handlePageChange,
  } = useCatalog({
    enabled: hasToken,
    authToken,
    companyId,
    todosImg,
    popularImg,
    categoryImages,
  });

  const loading = !isAuthResolved || (hasToken && catalogLoading);
  const appVersion = pkg.version;

  const [config, setConfig] = useLocalStorage<CompanyType>("restaurant-config", {
    externalCompanyId: initialUrlParams.externalCompanyId
      ? Number(initialUrlParams.externalCompanyId)
      : 0,
    productNameCompany: initialUrlParams.productNameCompany || "Movete",
    logoUrl: null,
    primaryColor: "#ffffffff",
    numberWhatsapp: 0,
    longitude: "",
    latitude: "",
    baseValue: 0,
    additionalValue: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const cartRef = useRef<CartRef | null>(null);
  const companyDisplayName = config.productNameCompany || "Movete";
  const primaryColor = config.primaryColor || "#0f172a";

  useEffect(() => {
    const updates: Partial<CompanyType> = {};
    if (initialUrlParams.productNameCompany) {
      updates.productNameCompany = initialUrlParams.productNameCompany;
    }
    if (initialUrlParams.externalCompanyId) {
      const n = Number(initialUrlParams.externalCompanyId);
      if (!isNaN(n)) updates.externalCompanyId = n;
    }
    if (Object.keys(updates).length > 0) {
      setConfig((prev) => ({ ...prev, ...updates }));
    }
  }, [initialUrlParams, setConfig]);

  useEffect(() => {
    if (company) {
      setConfig((prev) => ({
        externalCompanyId: company.externalCompanyId ?? prev.externalCompanyId,
        productNameCompany:
          company.productNameCompany || prev.productNameCompany || "Movete",
        logoUrl: company.logoUrl ?? prev.logoUrl,
        primaryColor: company.primaryColor || prev.primaryColor || "#ffffffff",
        numberWhatsapp: company.numberWhatsapp ?? prev.numberWhatsapp,
        longitude: company.longitude ?? prev.longitude,
        latitude: company.latitude ?? prev.latitude,
        baseValue: company.baseValue ?? prev.baseValue,
        additionalValue: company.additionalValue ?? prev.additionalValue,
      }));
    }
  }, [company, setConfig]);

  useEffect(() => {
    const defaultTitle = "Movete";
    const companyName = config.productNameCompany || defaultTitle;
    document.title = hasToken && companyName ? companyName : defaultTitle;
  }, [hasToken, config.productNameCompany]);

  useEffect(() => {
    const defaultHref = "/assets/image/default-favicon.png";

    let link = document.getElementById("favicon") as HTMLLinkElement | null;
    if (!link) {
      link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    }

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = hasToken && config.logoUrl ? config.logoUrl : defaultHref;
  }, [config.logoUrl, hasToken]);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: ProductType, quantity: number, comment: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, comment }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id.toString() !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id.toString() === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addCategory = (categoryData: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const editCategory = (id: string, categoryData: Omit<Category, "id">) => {
    const oldCategory = categories.find((cat) => cat.id === id);
    if (oldCategory) {
      setProducts((prev) =>
        prev.map((product) =>
          product.category === oldCategory.productName
            ? { ...product, category: categoryData.productName }
            : product
        )
      );
    }

    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...categoryData, id } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find((cat) => cat.id === id);
    if (categoryToDelete) {
      setProducts((prev) =>
        prev.filter((product) => product.category !== categoryToDelete.productName)
      );
      setCartItems((prev) =>
        prev.filter((item) => item.product.category !== categoryToDelete.productName)
      );
    }

    setCategories((prev) => prev.filter((category) => category.id !== id));
    if (activeCategory === categoryToDelete?.productName) {
      handleSelectCategory("all");
    }
  };

  const benefitItems: BenefitItem[] = [
    {
      title: "Envíos ágiles",
      description: "Entregas rápidas para que estrenes cuanto antes.",
    },
    {
      title: "Pagos seguros",
      description: "Transacciones protegidas para comprar con confianza.",
    },
    {
      title: "Cambios fáciles",
      description: "Flexibilidad para ajustar tu compra sin complicaciones.",
    },
    {
      title: "Soporte cercano",
      description: "Acompañamiento humano cuando lo necesites.",
    },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  if (!hasToken) {
    return <GenericScreen />;
  }

  return (
    <div className="min-h-screen bg-[#fff6f2]">
      <Header
        config={config}
        cartItemsCount={cartItemsCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onAdminToggle={() => setIsAdminOpen(!isAdminOpen)}
        isCartOpen={isCartOpen}
        isAdminOpen={isAdminOpen}
        style={{ backgroundColor: config.primaryColor }}
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
      />
      {templateLanding === "EcommerceLanding" ? (
        <EcommerceLanding
          config={config}
          companyDisplayName={companyDisplayName}
          featuredCategories={featuredCategories}
          benefitItems={benefitItems}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          onSelectFeaturedCategory={handleSelectFeaturedCategory}
          products={visibleProducts}
          allProducts={allProducts}
          onAddToCart={addToCart}
          primaryColor={primaryColor}
          searchTerm={searchTerm}
          onOpenCart={() => setIsCartOpen(true)}
          onDirectConfirm={() => cartRef.current?.sendOrder()}
          cartCount={cartItemsCount}
          isPagedMode={isPagedMode}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <RestaurantLanding
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          products={visibleProducts}
          allProducts={allProducts}
          onAddToCart={addToCart}
          primaryColor={primaryColor}
          searchTerm={searchTerm}
          onOpenCart={() => setIsCartOpen(true)}
          onDirectConfirm={() => cartRef.current?.sendOrder()}
          cartCount={cartItemsCount}
          isPagedMode={isPagedMode}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <Cart
        ref={cartRef}
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      />
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        onAddCategory={addCategory}
        onEditCategory={editCategory}
        onDeleteCategory={deleteCategory}
        config={config}
        onUpdateConfig={setConfig}
      />
      {templateLanding === "EcommerceLanding" ? (
        <footer className="text-center text-xs text-gray-500 py-6">
          <p>
            {companyDisplayName} · Versión {appVersion} · {totalElements} productos
          </p>
        </footer>
      ) : (
        <footer className="text-center text-xs text-gray-500 py-2">
          Versión {appVersion} · {totalElements} productos
        </footer>
      )}
    </div>
  );
}

export default App;
