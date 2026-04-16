import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Header } from "./components/Header";
import { Cart, CartRef } from "./components/Cart";
import LoadingScreen from "./components/LoadingScreen";
import { AdminPanel } from "./components/AdminPanel";
import { useLocalStorage } from "./hooks/useLocalStorage";
import pkg from "../package.json";
import { Category } from "./types";
import { getProductsByCompanyPaged } from "./Api/productsApi";
import { ProductType, CartItem, ProductsResponse } from "./types/productsType";
import { CompanyType } from "./types/companyType";
import { useCompanyLocal } from "./hooks/useCompanyLocal";
import GenericScreen from "./components/GenericScreen";
import { storeUrlParams, getStoredUrlParam, getAllStoredParams } from "./utils/urlParams";
import { CategoryOption } from "./components/CategorySelector";
import {
  EcommerceLanding,
  FeaturedCategory,
  BenefitItem,
} from "./components/EcommerceLanding.tsx";
import { RestaurantLanding } from "./components/RestaurantLanding";

const PAGE_SIZE = 5;

function App() {
  const initialUrlParams = useMemo(() => getAllStoredParams(), []);
  const [urlParams, setUrlParams] = useState<Record<string, string>>(initialUrlParams);

  const templateLanding =
    urlParams.templateLanding === "EcommerceLanding"
      ? "EcommerceLanding"
      : "RestaurantLanding";

  const allProducts: ProductsResponse | null = null;
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "restaurant-cart",
    []
  );
  const { company } = useCompanyLocal();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<
    "" | "priceLowToHigh" | "priceHighToLow"
  >("priceLowToHigh");

  const [hasToken, setHasToken] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isPagedMode, setIsPagedMode] = useState(true);

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
    [
      todosImg,
      hamburguesaImg,
      popularImg,
      combosImg,
      papitasImg,
      bebidaImg,
    ]
  );

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([
    { value: "all", label: "Ver todo", img: todosImg },
    { value: "HAMBURGUESAS", label: "Hamburguesa", img: hamburguesaImg },
    { value: "DESGRANADOS", label: "Desgranados", img: popularImg },
    { value: "PERROS", label: "Perros", img: combosImg },
    { value: "CHUZOS", label: "Chuzos", img: papitasImg },
    { value: "ALITAS", label: "Alitas", img: popularImg },
    { value: "CARNES", label: "Carnes", img: papitasImg },
    { value: "AREPAS", label: "Arepas", img: popularImg },
    { value: "GASEOSAS", label: "Gaseosas", img: bebidaImg },
    { value: "TOSTADAS", label: "Tostadas", img: combosImg },
    { value: "COMBOS", label: "Combos", img: papitasImg },
    { value: "MAIZITOS", label: "Maizitos", img: combosImg },
    { value: "APLASTADOS", label: "Aplastados", img: combosImg },
    { value: "SANDWICHES", label: "Sandwiches", img: combosImg },
    { value: "PAPAS", label: "Papas", img: papitasImg },
    { value: "ADICIONES", label: "Adiciones", img: papitasImg },
    { value: "JUGOS AGUA", label: "Jugos en agua", img: papitasImg },
    { value: "JUGOS EN LECHE", label: "Jugos en leche", img: papitasImg },
    { value: "FRAPPE AGUA ", label: "Frappe en agua", img: papitasImg },
    { value: "FRAPPE EN LECHE", label: "Frappe en leche", img: papitasImg },
    { value: "JUGOS HIT", label: "Jugos hit", img: papitasImg },
    { value: "MALTEADAS", label: "Malteadas", img: bebidaImg },
    { value: "CONSUMO EMPLEADOS", label: "Consumo empleados", img: papitasImg },
  ]);

  const appVersion = pkg.version;

  const [config, setConfig] = useLocalStorage<CompanyType>(
    "restaurant-config",
    {
      externalCompanyId: initialUrlParams.externalCompanyId ? Number(initialUrlParams.externalCompanyId) : 0,
      productNameCompany: initialUrlParams.productNameCompany || "Movete",
      logoUrl: null,
      primaryColor: "#ffffffff",
      numberWhatsapp: 0,
      longitude: "",
      latitude: "",
      baseValue: 0,
      additionalValue: 0,
    }
  );
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

    setUrlParams(initialUrlParams);
    storeUrlParams(initialUrlParams);
  }, [initialUrlParams, setConfig]);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm]);

  const loadPagedProducts = useCallback(
    async (targetPage: number) => {
      if (!authToken || companyId == null) return;

      const backendOrder = sortOption === "priceHighToLow" ? "DESC" : "ASC";
      const categoryParam = activeCategory === "all" ? undefined : activeCategory;
      const nameParam = debouncedSearchTerm.trim() ? debouncedSearchTerm.trim() : undefined;

      const result = await getProductsByCompanyPaged({
        token: authToken,
        externalCompanyId: companyId,
        page: targetPage,
        size: PAGE_SIZE,
        orders: backendOrder,
        sortBy: "productId",
        category: categoryParam,
        name: nameParam,
      });

      setProducts(result.items);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setIsPagedMode(true);
    },
    [authToken, companyId, sortOption, activeCategory, debouncedSearchTerm]
  );

  useEffect(() => {
    const freshParams = getAllStoredParams();
    const token = freshParams.token ?? getStoredUrlParam("token") ?? "";
    const externalCompanyIdParam =
      freshParams.externalCompanyId ?? getStoredUrlParam("externalCompanyId") ?? "";

    if (!token) {
      setHasToken(false);
      setLoading(false);
      return;
    }

    const parsedCompanyId = Number(externalCompanyIdParam);
    if (!Number.isFinite(parsedCompanyId) || parsedCompanyId <= 0) {
      setHasToken(false);
      setLoading(false);
      return;
    }

    setAuthToken(token);
    setCompanyId(parsedCompanyId);
    setHasToken(true);
  }, []);

  useEffect(() => {
    if (!authToken || companyId == null) return;

    let cancelled = false;
    (async () => {
      try {
        await loadPagedProducts(page);
      } catch (e) {
        if (cancelled) return;
        console.error("Error al obtener productos paginados:", e);
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authToken, companyId, page, loadPagedProducts]);

  useEffect(() => {
    const discovered = Array.from(
      new Set(
        products
          .map((p) => (p.category || "").trim())
          .filter((name) => name.length > 0)
      )
    );

    if (discovered.length === 0) return;

    setCategoryOptions((prev) => {
      const known = new Set(prev.map((p) => p.value.toUpperCase()));
      const additions = discovered
        .filter((name) => !known.has(name.toUpperCase()))
        .map((name) => ({
          value: name,
          label: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
          img: categoryImages[name.toUpperCase()] || popularImg,
        }));

      if (additions.length === 0) return prev;
      return [...prev, ...additions];
    });
  }, [products, categoryImages, popularImg]);

  const addToCart = (
    product: ProductType,
    quantity: number,
    comment: string
  ) => {
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

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id.toString() === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id.toString() !== id)
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
        prev.filter(
          (product) => product.category !== categoryToDelete.productName
        )
      );
      setCartItems((prev) =>
        prev.filter(
          (item) => item.product.category !== categoryToDelete.productName
        )
      );
    }
    setCategories((prev) => prev.filter((category) => category.id !== id));
    if (activeCategory === categoryToDelete?.productName) {
      setActiveCategory("all");
    }
  };

  const visibleProducts = products;

  const handleSortChange = useCallback(
    (opt: "" | "priceLowToHigh" | "priceHighToLow") => {
      setSortOption(opt);
      setPage(0);
    },
    []
  );

  const handleSelectCategory = useCallback((value: string) => {
    setActiveCategory(value);
    setPage(0);
  }, []);

  const handleSelectFeaturedCategory = useCallback((value: string) => {
    setSearchTerm("");
    setActiveCategory(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (nextPage < 0 || nextPage >= totalPages) return;
      setPage(nextPage);
    },
    [totalPages]
  );

  const featuredCategories: FeaturedCategory[] = useMemo(() => {
    const counts = visibleProducts.reduce<Record<string, number>>((acc, p) => {
      const key = (p.category || "").trim();
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([key, count]) => {
        const option = categoryOptions.find(
          (opt) => opt.value.toUpperCase() === key.toUpperCase()
        );
        return {
          value: key,
          label:
            option?.label ||
            key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
          img: option?.img || categoryImages[key.toUpperCase()] || popularImg,
          count,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [visibleProducts, categoryOptions, categoryImages, popularImg]);

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
