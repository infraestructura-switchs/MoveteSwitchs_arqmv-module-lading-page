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
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isPagedMode, setIsPagedMode] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([
    { value: "all", label: "Ver todo", img: todosImg },
  ]);
  const [apiCategoryKeys, setApiCategoryKeys] = useState<string[]>([]);

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
    (names: string[]): CategoryOption[] => {
      const allOption: CategoryOption = {
        value: "all",
        label: "Ver todo",
        img: todosImg,
      };

      const unique = new Map<string, string>();
      names.forEach((name) => {
        const trimmed = (name || "").trim();
        if (!trimmed) return;
        const normalized = normalizeCategoryKey(trimmed);
        if (!unique.has(normalized)) {
          unique.set(normalized, trimmed.replace(/\s+/g, " "));
        }
      });

      const dynamicOptions = Array.from(unique.entries()).map(([, original]) => ({
        value: original,
        label: formatCategoryLabel(original),
        img: resolveCategoryImage(original, categoryImages, popularImg),
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

        const normalizedKeys = categoriesFromApi
          .map((name) => normalizeCategoryKey(name))
          .filter((name) => name.length > 0);

        setApiCategoryKeys(Array.from(new Set(normalizedKeys)));
        setCategoryOptions(buildCategoryOptions(categoriesFromApi));
      } catch (error) {
        if (cancelled) return;
        console.error("Error al obtener categorías por compañía:", error);
        setApiCategoryKeys([]);
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

    const exists = categoryOptions.some(
      (option) =>
        normalizeCategoryKey(option.value) === normalizeCategoryKey(activeCategory)
    );
    if (!exists) {
      setActiveCategory("all");
      setPage(0);
    }
  }, [categoryOptions, activeCategory]);

  const apiCategorySet = useMemo(() => new Set(apiCategoryKeys), [apiCategoryKeys]);

  const visibleProducts = useMemo(() => {
    if (apiCategorySet.size === 0) return products;
    return products.filter((product) => {
      const productCategory = normalizeCategoryKey(product.category || "");
      return apiCategorySet.has(productCategory);
    });
  }, [products, apiCategorySet]);

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
          (opt) => normalizeCategoryKey(opt.value) === normalizeCategoryKey(key)
        );
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
