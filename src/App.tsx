import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Header } from "./components/Header";
import { Cart, CartRef } from "./components/Cart";
import LoadingScreen from "./components/LoadingScreen";
import { AdminPanel } from "./components/AdminPanel";
import { useLocalStorage } from "./hooks/useLocalStorage";
import pkg from "../package.json";
import { toProductType } from "./utils/category";
import { Category } from "./types";
import {
  getProductsByCompany,
  searchProducts,
  getProductsSorted,
} from "./Api/productsApi";
import {
  ProductType,
  CartItem,
  ProductsResponse,
  FullProductsResponse,
} from "./types/productsType";
import { CompanyType } from "./types/companyType";
import { useCompanyLocal } from "./hooks/useCompanyLocal";
import GenericScreen from "./components/GenericScreen";

// refactored units
import { storeUrlParams, getStoredUrlParam, getAllStoredParams } from "./utils/urlParams";
import { CategoryOption } from "./components/CategorySelector";
import {
  EcommerceLanding,
  FeaturedCategory,
  BenefitItem,
} from "./components/EcommerceLanding";
import { RestaurantLanding } from "./components/RestaurantLanding";

function App() {
  const initialUrlParams = useMemo(() => getAllStoredParams(), []);

  function getStoredUrlParamLocal(key: string): string | null {
    return getStoredUrlParam(key);
  }


  const [urlParams, setUrlParams] = useState<Record<string, string>>(initialUrlParams);
  // urlParams are available via centralized storage; individual components
  // should use `getUrlParam`/helpers when needed. Avoid unused vars here.
  const templateLanding =
    urlParams.templateLanding === "EcommerceLanding"
      ? "EcommerceLanding"
      : "RestaurantLanding";

  const [allProducts, setAllProducts] = useState<ProductsResponse | null>(null);
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
  // arrows and scrolling are now handled inside <CategorySelector>,
  // so we don't need these pieces of state any longer.
  const fetchedRef = useRef(false);
  const reqIdRef = useRef(0);
  const [sortOption, setSortOption] = useState<
    "" | "priceLowToHigh" | "priceHighToLow"
  >("");
  const sortAbortRef = useRef<AbortController | null>(null);
  const [hasToken, setHasToken] = useState(false);

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

  const [categoryOptions, setCategoryOptions] = useState<
    CategoryOption[]
  >([
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

  
  // read version number from package.json so it can be shown in the footer
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

  const externalCompanyId = getStoredUrlParamLocal("externalCompanyId") ?? "";

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
  }, [initialUrlParams, setConfig, setUrlParams]);

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // debug: expose cartItemsCount to browser console
  // eslint-disable-next-line no-console
  console.log('[debug] App cartItemsCount:', cartItemsCount);

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
    console.debug("title effect run; hasToken=", hasToken, "companyName=", companyName);

    if (hasToken && companyName) {
      document.title = companyName;
      console.debug("set document.title to companyName");
    } else {
      document.title = defaultTitle;
      console.debug("set document.title to default");
    }
  }, [hasToken, config.productNameCompany]);


  useEffect(() => {
    const defaultHref = "/assets/image/default-favicon.png";
    console.debug("favicon effect run; hasToken=", hasToken, "logoUrl=", config.logoUrl);

    let link = document.getElementById("favicon") as HTMLLinkElement | null;
    if (!link) {
      link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    }

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    if (hasToken && config.logoUrl) {
      link.href = config.logoUrl;
      console.debug("set favicon to logoUrl", config.logoUrl);
    } else {
      link.href = defaultHref;
      console.debug("set favicon to default", defaultHref);
    }
  }, [config.logoUrl, hasToken]);

useEffect(() => {
  if (fetchedRef.current) return;

  const freshParams = getAllStoredParams();
  const token = freshParams.token ?? getStoredUrlParam("token") ?? "";
  const externalCompanyId = freshParams.externalCompanyId ?? getStoredUrlParam("externalCompanyId") ?? "";

  if (!token) {
    setHasToken(false);
    setLoading(false);
    return;
  }

  fetchedRef.current = true;
  (async () => {
    try {

      let parsedExternalCompanyId: number | undefined = undefined;
        if (externalCompanyId) {
          const n = Number(externalCompanyId);
          if (!isNaN(n)) parsedExternalCompanyId = n;
        }
        console.debug("fetching products with", { token, parsedExternalCompanyId });

        const data: FullProductsResponse = await getProductsByCompany(
          token,
          parsedExternalCompanyId
      );
      console.debug("received products payload", data);
      const normalized: ProductsResponse = {};
      // Prefer productsByCategory when backend provides it (format=both/map).
      if (data && data.productsByCategory && typeof data.productsByCategory === "object") {
        Object.entries(data.productsByCategory).forEach(([categoryName, products]) => {
          normalized[categoryName] = (products || []).map(toProductType);
        });
      } else if (data && Array.isArray(data.categories)) {
        data.categories.forEach(({ categoryName, products }) => {
          normalized[categoryName] = (products || []).map(toProductType);
        });
      }

      console.debug("normalized products map", normalized);
      setAllProducts(normalized);

      const all: ProductType[] = Object.values(normalized).reduce<ProductType[]>(
        (arr, list) => arr.concat(list), []
      );

      setProducts(all);

const catKeys = Object.keys(normalized);
const dynamicOptions = [
  { value: "all", label: "Ver todo", img: todosImg },
  ...catKeys.map((key) => {
    const baseKey = key.split(/\s*[-–]\s*/)[0].trim().toUpperCase();
    const existing = categoryOptions.find(
      (opt) => opt.value === key || opt.value === baseKey
    );
    return {
      value: key,
      label: existing?.label || (baseKey.charAt(0).toUpperCase() + baseKey.slice(1).toLowerCase()),
      img: existing?.img || categoryImages[baseKey] || categoryImages[key] || popularImg,
    };
  }),
];
      setCategoryOptions(dynamicOptions);
      setActiveCategory("all");

      setHasToken(true);
      setLoading(false);
    } catch (e) {
      console.error("Error al obtener productos:", e);
      setProducts([]);
      setHasToken(false);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  })();
}, [initialUrlParams]);


  const fetchSortedFromBackend = useCallback(async (
    opt: "priceLowToHigh" | "priceHighToLow",
    categoryValue?: string,
    nameValue?: string
  ) => {
    if (sortAbortRef.current) sortAbortRef.current.abort();
    const controller = new AbortController();
    sortAbortRef.current = controller;
    const sort = opt === "priceLowToHigh" ? "ASC" : "DESC";
    const categoryParam =
      (categoryValue ?? activeCategory) === "all"
        ? undefined
        : (categoryValue ?? activeCategory).trim();

    try {
      const result = await getProductsSorted({
        externalCompanyId: parseInt(externalCompanyId),
        sort,
        category: categoryParam,
        name: nameValue?.trim() ? nameValue.trim() : undefined,
        signal: controller.signal,
      });
      setProducts(result);
    } catch (err) {
      const errObj = err as { name?: string; code?: string };
      if (
        errObj?.name !== "AbortError" &&
        errObj?.code !== "ERR_CANCELED" &&
        errObj?.name !== "CanceledError"
      ) {
        console.error(err);
      }
      setProducts([]);
    }
  }, [activeCategory, externalCompanyId]);

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
      } else {
        return [...prev, { product, quantity, comment }];
      }
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

  const filterProducts = useCallback((category: string) => {
    if (!allProducts) {
      setProducts([]);
      return;
    }
    if (category === "all") {
      const all: ProductType[] = Object.values(allProducts).reduce<
        ProductType[]
      >((acc, cur) => acc.concat(cur), []);
      setProducts(all);
      return;
    }
    const key = category.trim().toUpperCase();
    setProducts(allProducts[key] ?? []);
  }, [allProducts]);

  const handleSortChange = useCallback((
    opt: "" | "priceLowToHigh" | "priceHighToLow"
  ) => {
    setSortOption(opt);

    if (!opt) {
      if (searchTerm.trim()) {
        (async () => {
          const categoryParam =
            activeCategory === "all" ? undefined : activeCategory.trim();
          try {
            const results = await searchProducts({
              externalCompanyId: parseInt(externalCompanyId),
              name: searchTerm.trim(),
              category: categoryParam,
            });
            setProducts(results);
          } catch (e) {
            console.error(e);
            setProducts([]);
          }
        })();
      } else {
        filterProducts(activeCategory);
      }
      return;
    }
    fetchSortedFromBackend(opt, activeCategory, searchTerm);
  }, [
    activeCategory,
    externalCompanyId,
    fetchSortedFromBackend,
    filterProducts,
    searchTerm,
  ]);

  const handleSelectCategory = useCallback((value: string) => {
    setActiveCategory(value);
    filterProducts(value);
  }, [filterProducts]);

  const handleSelectFeaturedCategory = useCallback((value: string) => {
    setSearchTerm("");
    setSortOption("");
    setActiveCategory(value);
    filterProducts(value);
  }, [filterProducts]);

  useEffect(() => {
    const term = searchTerm.trim();
    const controller = new AbortController();
    const myReqId = ++reqIdRef.current;

    if (term === "") {
      controller.abort();
      if (sortOption) {
        fetchSortedFromBackend(sortOption, activeCategory, undefined);
      } else {
        filterProducts(activeCategory);
      }
      return () => controller.abort();
    }

    const t = setTimeout(async () => {
      try {
        const categoryParam =
          activeCategory === "all" ? undefined : activeCategory.trim();
        const results = await searchProducts({
          externalCompanyId: parseInt(externalCompanyId),
          name: term,
          category: categoryParam,
          signal: controller.signal,
        });
        if (reqIdRef.current !== myReqId) return;

        setProducts(results);
      } catch (err) {
        const errObj = err as { name?: string };
        if (errObj?.name === "AbortError") return;
        setProducts([]);
      }
    }, 300);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [
    searchTerm,
    activeCategory,
    sortOption,
    externalCompanyId,
    fetchSortedFromBackend,
    filterProducts,
  ]);

  const featuredCategories: FeaturedCategory[] = (() => {
    if (!allProducts) return [];
    const entries = Object.entries(allProducts)
      .filter(([key]) => key.toLowerCase() !== "all")
      .map(([key, items]) => ({ key, count: items.length }))
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    return entries.map((entry) => {
      const option = categoryOptions.find((opt) => opt.value === entry.key);
      return {
        value: entry.key,
        label:
          option?.label ||
          entry.key.charAt(0).toUpperCase() + entry.key.slice(1).toLowerCase(),
        img: option?.img || categoryImages[entry.key] || popularImg,
        count: entry.count,
      };
    });
  })();

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
          products={products}
          allProducts={allProducts}
          onAddToCart={addToCart}
          primaryColor={primaryColor}
          searchTerm={searchTerm}
            onOpenCart={() => setIsCartOpen(true)}
            onDirectConfirm={() => cartRef.current?.sendOrder()}
            cartCount={cartItemsCount}
        />
      ) : (
        <RestaurantLanding
          categoryOptions={categoryOptions}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          products={products}
          allProducts={allProducts}
          onAddToCart={addToCart}
          primaryColor={primaryColor}
          searchTerm={searchTerm}
            onOpenCart={() => setIsCartOpen(true)}
            onDirectConfirm={() => cartRef.current?.sendOrder()}
            cartCount={cartItemsCount}
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
            {companyDisplayName} · Versión {appVersion}
          </p>
        </footer>
      ) : (
        <footer className="text-center text-xs text-gray-500 py-2">
          Versión {appVersion}
        </footer>
      )}
    </div>
  );
}

export default App;
