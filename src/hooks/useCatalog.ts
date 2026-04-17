import { useCallback, useEffect, useMemo, useState } from "react";
import { getProductsByCompanyPaged } from "../Api/productsApi";
import { getCategoriesByExternalCompany } from "../Api/categoriesApi";
import type { ProductType } from "../types/productsType";
import type { CategoryOption } from "../components/CategorySelector";
import { resolveCategoryImage } from "../utils/categoryImageMatcher";

export type SortOption = "" | "priceLowToHigh" | "priceHighToLow";

export type FeaturedCategory = {
  value: string;
  label: string;
  img: string;
  count: number;
};

type UseCatalogParams = {
  enabled: boolean;
  authToken: string;
  companyId: number | null;
  todosImg: string;
  popularImg: string;
  categoryImages: Record<string, string>;
  pageSize?: number;
};

const normalizeCategoryKey = (value: string): string =>
  value.trim().replace(/\s+/g, " ").toUpperCase();

const formatCategoryLabel = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function useCatalog({
  enabled,
  authToken,
  companyId,
  todosImg,
  popularImg,
  categoryImages,
  pageSize = 5,
}: UseCatalogParams) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("priceLowToHigh");
  const [activeCategory, setActiveCategory] = useState<string | number>("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isPagedMode, setIsPagedMode] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([
    { value: "all", label: "Ver todo", img: todosImg },
  ]);
  const [apiCategoryKeys, setApiCategoryKeys] = useState<string[]>([]);
  const [apiCategoryIds, setApiCategoryIds] = useState<number[]>([]);

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
      if (!enabled || !authToken || companyId == null) return;

      const backendOrder = sortOption === "priceHighToLow" ? "DESC" : "ASC";
      const categoryParam = activeCategory === "all" ? undefined : activeCategory;
      const nameParam = debouncedSearchTerm.trim()
        ? debouncedSearchTerm.trim()
        : undefined;

      const result = await getProductsByCompanyPaged({
        token: authToken,
        externalCompanyId: companyId,
        page: targetPage,
        size: pageSize,
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
    [
      enabled,
      authToken,
      companyId,
      sortOption,
      activeCategory,
      debouncedSearchTerm,
      pageSize,
    ]
  );

  useEffect(() => {
    if (!enabled || !authToken || companyId == null) return;

    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      try {
        await loadPagedProducts(page);
      } catch (e) {
        if (cancelled) return;
        console.error("Error al obtener productos paginados:", e);
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, authToken, companyId, page, loadPagedProducts]);

  const buildCategoryOptions = useCallback(
    (items: Array<string | { id: number; name: string }>): CategoryOption[] => {
      const allOption: CategoryOption = {
        value: "all",
        label: "Ver todo",
        img: todosImg,
      };
      const unique = new Map<string, { id?: number; name: string }>();

      items.forEach((it) => {
        if (typeof it === "string") {
          const trimmed = (it || "").trim();
          if (!trimmed) return;
          const normalized = normalizeCategoryKey(trimmed);
          if (!unique.has(normalized)) unique.set(normalized, { name: trimmed.replace(/\s+/g, " ") });
        } else if (it && typeof it === "object") {
          const name = (it.name || "").toString().trim();
          if (!name) return;
          const normalized = normalizeCategoryKey(name);
          const id = typeof it.id === "number" && Number.isFinite(it.id) ? it.id : undefined;
          const existing = unique.get(normalized);
          if (!existing) unique.set(normalized, { id, name: name.replace(/\s+/g, " ") });
          else if (!existing.id && id) existing.id = id;
        }
      });

      const dynamicOptions: CategoryOption[] = Array.from(unique.values()).map((entry) => ({
        value: entry.id != null ? entry.id : entry.name,
        id: entry.id,
        label: formatCategoryLabel(entry.name),
        img: resolveCategoryImage(entry.name, categoryImages, popularImg),
      }));

      return [allOption, ...dynamicOptions];
    },
    [todosImg, categoryImages, popularImg]
  );

  useEffect(() => {
    if (!enabled || !authToken || companyId == null) return;

    let cancelled = false;
    (async () => {
      try {
        const categoriesFromApi = await getCategoriesByExternalCompany(
          companyId,
          authToken
        );
        if (cancelled) return;

        const names = categoriesFromApi
          .map((it) => (typeof it === "string" ? it : it.name))
          .filter(Boolean) as string[];

        const ids = categoriesFromApi
          .map((it) => (typeof it === "object" && typeof it.id === "number" ? it.id : undefined))
          .filter((v): v is number => v != null);

        setApiCategoryIds(Array.from(new Set(ids)));

        const normalizedKeys = names.map((n) => normalizeCategoryKey(n)).filter((n) => n.length > 0);

        setApiCategoryKeys(Array.from(new Set(normalizedKeys)));
        setCategoryOptions(buildCategoryOptions(categoriesFromApi));
      } catch (error) {
        if (cancelled) return;
        console.error("Error al obtener categorías por compañía:", error);
        setApiCategoryKeys([]);
        setApiCategoryIds([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, authToken, companyId, buildCategoryOptions]);

  useEffect(() => {
    if (apiCategoryKeys.length > 0) return;

    const discovered = Array.from(
      new Set(
        products
          .map((p) => (p.category || "").trim())
          .filter((name) => name.length > 0)
      )
    );

    if (discovered.length === 0) return;
    setCategoryOptions(buildCategoryOptions(discovered));
  }, [products, apiCategoryKeys, buildCategoryOptions]);

  useEffect(() => {
    if (activeCategory === "all") return;

    const exists = categoryOptions.some((option) => {
      if (typeof activeCategory === "number" && typeof option.value === "number") return activeCategory === option.value;
      const optValStr = typeof option.value === "number" ? String(option.value) : option.value;
      return normalizeCategoryKey(optValStr) === normalizeCategoryKey(String(activeCategory));
    });
    if (!exists) {
      setActiveCategory("all");
      setPage(0);
    }
  }, [categoryOptions, activeCategory]);

  const apiCategorySet = useMemo(() => new Set(apiCategoryKeys), [apiCategoryKeys]);
  const apiCategoryIdSet = useMemo(() => new Set(apiCategoryIds), [apiCategoryIds]);

  const visibleProducts = useMemo(() => {
    if (apiCategorySet.size === 0 && apiCategoryIdSet.size === 0) return products;
    return products.filter((product) => {
      const productCategory = normalizeCategoryKey(product.category || "");
      if (productCategory && apiCategorySet.has(productCategory)) return true;
      if (typeof product.categoryId === "number" && apiCategoryIdSet.has(product.categoryId)) return true;
      return false;
    });
  }, [products, apiCategorySet, apiCategoryIdSet]);

  const featuredCategories: FeaturedCategory[] = useMemo(() => {
    const counts = visibleProducts.reduce<Record<string, number>>((acc, p) => {
      const key = (p.category || "").trim();
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([key, count]) => {
        const option = categoryOptions.find((opt) => normalizeCategoryKey(opt.label) === normalizeCategoryKey(key));
        return {
          value: key,
          label: option?.label || formatCategoryLabel(key),
          img: option?.img || resolveCategoryImage(key, categoryImages, popularImg),
          count,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [visibleProducts, categoryOptions, categoryImages, popularImg]);

  const handleSortChange = useCallback((opt: SortOption) => {
    setSortOption(opt);
    setPage(0);
  }, []);

  const handleSelectCategory = useCallback((value: string | number) => {
    setActiveCategory(value);
    setPage(0);
  }, []);

  const handleSelectFeaturedCategory = useCallback((value: string | number) => {
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

  return {
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
  };
}
