import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import { Cart } from "./components/Cart";
import LoadingScreen from "./components/LoadingScreen";
import { AdminPanel } from "./components/AdminPanel";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toProductType } from "./utils/category";
import { Category } from "./types";
import {
  getProductsByCompany,
  searchProducts,
  getProductsSorted,
} from "./Api/productsApi";
import {
  ProductType,
  ApiResponse,
  CartItem,
  ProductsResponse,
} from "./types/productsType";
import { CompanyTypeLocal } from "./hooks/useLocalStorage";
import { useCompanyLocal } from "./hooks/useCompanyLocal";
import { Alert } from "@mui/material";
import GenericScreen from "./components/GenericScreen";

function App() {
  const [allProducts, setAllProducts] = useState<ProductsResponse | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "restaurant-cart",
    []
  );
  const { company } = useCompanyLocal();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLeftArrow, setShowLeftArrow] = useState(true);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);
  const bannersRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const reqIdRef = useRef(0);
  const [sortOption, setSortOption] = useState<
    "" | "priceLowToHigh" | "priceHighToLow"
  >("");
  const sortAbortRef = useRef<AbortController | null>(null);
  const [hasToken, setHasToken] = useState(false);

  const bebidaImg = "/assets/icons/bebida.png";
  const combosImg = "/assets/icons/combos.png";
  const hamburguesaImg = "/assets/icons/hamburguesa.png";
  const descuentoImg = "/assets/icons/descuento.png";
  const papitasImg = "/assets/icons/papitas.png";
  const popularImg = "/assets/icons/popular.png";
  const todosImg = "/assets/icons/todos.png";

  const categoryImages: Record<string, string> = {
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
  };

  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string; img: string }[]
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

  const [config, setConfig] = useLocalStorage<CompanyTypeLocal>(
    "restaurant-config",
    {
      productNameCompany: "Chuzo de ivan",
      primaryColor: "#ffffffff",
    }
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const tokenParam = window.location.search || window.location.hash.split("?")[1] || "";
  const token = new URLSearchParams(tokenParam).get("token") ?? "";
  const companyId = new URLSearchParams(tokenParam).get("companyId") ?? "";

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    if (company) {
      setConfig({
        ...company,
        primaryColor: "#ffffffff",
      });
    }
  }, [company]);

useEffect(() => {
  if (fetchedRef.current) return;
  fetchedRef.current = true;

  if (!token) {
    console.error("Token no proporcionado o vacío");
    setTimeout(() => {
      setLoading(false);
      setHasToken(false);
    }, 1000);
    return;
  }

  (async () => {
    try {
      const data: ApiResponse = await getProductsByCompany(token);
      const normalized: ProductsResponse = (data.categories ?? []).reduce(
        (acc: ProductsResponse, c) => {
          const key = String(c.categoryName ?? "")
            .trim()
            .toUpperCase();
          const items: ProductType[] = (c.products ?? []).map((dto) => {
            const mapped = toProductType(dto);
            return { ...mapped, category: key };
          });
          acc[key] = items;
          return acc;
        },
        {}
      );

      setAllProducts(normalized);

      const all: ProductType[] = Object.values(normalized).reduce<ProductType[]>(
        (arr, list) => arr.concat(list), []
      );

      setProducts(all);

      const catKeys = Object.keys(normalized);
      const dynamicOptions = [
        { value: "all", label: "Ver todo", img: todosImg },
        ...categoryOptions.filter(
          (opt) => opt.value !== "all" && catKeys.includes(opt.value)
        ),
        ...catKeys
          .filter((key) => !categoryOptions.some((opt) => opt.value === key))
          .map((key) => ({
            value: key,
            label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
            img: categoryImages[key] || popularImg,
          })),
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
}, []); 


  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const el = bannersRef.current;
    if (el) {
      const scroll = () => {
        if (!el) return;
        el.scrollLeft += 1;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      };
      scrollInterval.current = setInterval(scroll, 20);
      return () => {
        if (scrollInterval.current) {
          clearInterval(scrollInterval.current);
        }
      };
    }
  }, [isVisible]);

  useEffect(() => {
    const checkScroll = () => {
      if (categoriesRef.current) {
        const scrollLeft = categoriesRef.current.scrollLeft;
        const scrollWidth = categoriesRef.current.scrollWidth;
        const clientWidth = categoriesRef.current.clientWidth;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
      }
    };
    const refCurrent = categoriesRef.current;
    if (refCurrent) {
      refCurrent.addEventListener("scroll", checkScroll);
    }
    checkScroll();
    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const fetchSortedFromBackend = async (
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
        companyId: parseInt(companyId),
        sort,
        category: categoryParam,
        name: nameValue?.trim() ? nameValue.trim() : undefined,
        signal: controller.signal,
      });
      setProducts(result);
    } catch (err: any) {
      if (err?.name !== "AbortError") console.error(err);
      setProducts([]);
    }
  };

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
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 1000);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
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

  const filterProducts = (category: string) => {
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
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const opt = event.target.value as "" | "priceLowToHigh" | "priceHighToLow";
    setSortOption(opt);

    if (!opt) {
      if (searchTerm.trim()) {
        (async () => {
          const categoryParam =
            activeCategory === "all" ? undefined : activeCategory.trim();
          try {
            const results = await searchProducts({
              companyId:parseInt(companyId),
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
  };

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
          companyId: parseInt(companyId),
          name: term,
          category: categoryParam,
          signal: controller.signal,
        });
        if (reqIdRef.current !== myReqId) return;

        setProducts(results);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Error en búsqueda:", err);
        setProducts([]);
      }
    }, 300);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [searchTerm, activeCategory, sortOption]);

  const banners = [
    {
      title: "Nuevo en parrilla",
      subtitle: "Desde hoy",
      date: "Hasta el 28 de febrero",
      discount: "25% OFF",
      color: "#FF0000",
      bg: "#FFD932",
      image:
        "https://res.cloudinary.com/dfotyo6jc/image/upload/v1754405816/lucide_image_efuwrp.png",
    },
    {
      title: "Super Aliado",
      subtitle: "Solo por hoy",
      date: "de 2:00 a 6:00 pm",
      discount: "60% OFF",
      color: "#0099FF",
      bg: "#FFE066",
      image:
        "https://res.cloudinary.com/dfotyo6jc/image/upload/v1754405816/lucide_image_efuwrp.png",
    },
    {
      title: "Nuevo en parrilla",
      subtitle: "Desde hoy",
      date: "Hasta el 28 de febrero",
      discount: "25% OFF",
      color: "#FF0000",
      bg: "#FFD932",
      image:
        "https://res.cloudinary.com/dfotyo6jc/image/upload/v1754405816/lucide_image_efuwrp.png",
    },
    {
      title: "Super Aliado",
      subtitle: "Solo por hoy",
      date: "de 2:00 a 6:00 pm",
      discount: "60% OFF",
      color: "#0099FF",
      bg: "#FFE066",
      image:
        "https://res.cloudinary.com/dfotyo6jc/image/upload/v1754405816/lucide_image_efuwrp.png",
    },
    {
      title: "Nuevo en parrilla",
      subtitle: "Desde hoy",
      date: "Hasta el 28 de febrero",
      discount: "25% OFF",
      color: "#FF0000",
      bg: "#FFD932",
      image:
        "https://res.cloudinary.com/dfotyo6jc/image/upload/v1754405816/lucide_image_efuwrp.png",
    },
    {
      title: "Super Aliado",
      subtitle: "Solo por hoy",
      date: "de 2:00 a 6:00 pm",
      discount: "60% OFF",
      color: "#0099FF",
      bg: "#FFE066",
      image:
        "https://res.cloudinary.com/dfotyo6jc/image/upload/v1754405816/lucide_image_efuwrp.png",
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
      {/*  
      {showNotification && (
        <div className="fixed top-4 right-4 w-full max-w-xs z-50">
          <Alert
            severity="success"
            className="!text-xs !py-2 !px-3 flex justify-between items-center"
            action={
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-500 hover:text-gray-700 flex items-center justify-center w-6 h-6 rounded-full"
              >
                X
              </button>
            }
          >
            ¡Producto agregado al carrito!
          </Alert>
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 mt-4 relative">
        <div
          ref={bannersRef}
          className="flex space-x-8 overflow-x-auto pb-2 scroll-smooth banners-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          {[...banners, ...banners].map((banner, idx) => (
            <div
              key={idx}
              className="min-w-[300px] max-w-[320px] h-[140px] flex-shrink-0 rounded-2xl flex items-center px-6 py-4 relative"
              style={{
                background: banner.bg === "#FFE066" ? "#FFE066" : "#FF1C1C",
                boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
              }}
            >
              {banner.bg === "#FFE066" ? (
                <span
                  className="absolute top-4 left-6 bg-[#0099FF] text-white text-xs font-bold px-3 py-1 rounded-full shadow"
                  style={{ letterSpacing: 0.5 }}
                >
                  Super Aliados
                </span>
              ) : (
                <span
                  className="absolute top-4 left-6 bg-[#00C853] text-white text-xs font-bold px-3 py-1 rounded-full shadow"
                  style={{ letterSpacing: 0.5 }}
                >
                  Nuevo en parrilla
                </span>
              )}
              <div className="flex-1 flex flex-col justify-between h-full pl-0 pt-6">
                <div>
                  <div
                    className={`font-bold leading-5 ${
                      banner.bg === "#FFE066"
                        ? "text-black text-lg"
                        : "text-white text-lg"
                    }`}
                  >
                    {banner.bg === "#FFE066" ? "Solo por hoy" : "Desde hoy"}
                  </div>
                  <div
                    className={`text-sm ${
                      banner.bg === "#FFE066" ? "text-black" : "text-white"
                    }`}
                  >
                    {banner.bg === "#FFE066"
                      ? "de 2:00 a 6:00 pm"
                      : "Hasta el 28 de febrero"}
                  </div>
                </div>
                <span
                  className={`mt-1 font-extrabold rounded-lg text-xl ${
                    banner.bg === "#FFE066" ? "text-white" : "text-white"
                  } text-center`}
                  style={{
                    background: banner.bg === "#FFE066" ? "#FFB300" : "#7B1FFF",
                    color: "#fff",
                    display: "inline-block",
                    minWidth: "unset",
                    width: "110px",
                    padding: "4px 0",
                    margin: 0,
                    lineHeight: 1.2,
                    verticalAlign: "middle",
                    borderRadius: "50px",
                  }}
                >
                  {banner.discount}
                </span>
              </div>
              <img
                src={banner.image}
                alt="promo"
                className="object-contain ml-4"
                style={{ maxWidth: "50%", height: "auto" }}
              />
            </div>
          ))}
        </div>
        <style>{`.banners-scroll::-webkit-scrollbar { display: none; }`}</style>
      </div>
      */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
        <main>
          <div className="relative w-full">
            <div
              ref={categoriesRef}
              className="flex space-x-8 overflow-x-auto pb-2 scroll-smooth categories-scroll whitespace-nowrap"
            >
              {categoryOptions.map((category) => (
                <div
                  key={category.value}
                  onClick={() => {
                    setActiveCategory(category.value);
                    filterProducts(category.value);
                  }}
                  className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${
                    activeCategory === category.value
                      ? "bg-red-500 text-white"
                      : "bg-transparent text-gray-700"
                  }`}
                >
                  <img
                    src={category.img}
                    alt={category.label}
                    className="w-8 h-8 mb-2 object-contain"
                  />
                  <span className="text-sm font-semibold">
                    {category.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 mb-6">
            <span className="text-sm text-gray-500">Ordenar por:</span>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 border rounded-full w-64 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Seleccionar</option>
              <option value="priceLowToHigh">Menor precio</option>
              <option value="priceHighToLow">Mayor precio</option>
            </select>
          </div>
          <div className="mb-8">
            {activeCategory === "all" && !searchTerm && !sortOption ? (
              allProducts ? (
                categoryOptions
                  .filter((option) => option.value !== "all")
                  .map(
                    (option) =>
                      allProducts[option.value]?.length > 0 && (
                        <div key={option.value} className="mb-6">
                          <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {option.label}
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 md:gap-6">
                            {allProducts[option.value].map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                                primaryColor={config.primaryColor}
                              />
                            ))}
                          </div>
                        </div>
                      )
                  )
              ) : null
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 md:gap-6">
                {products.length > 0
                  ? products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        primaryColor={config.primaryColor}
                      />
                    ))
                  : null}
              </div>
            )}
          </div>
        </main>
      </div>
      <Cart
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
        onRemoveItem={removeFromCart}
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
    </div>
  );
}

export default App;