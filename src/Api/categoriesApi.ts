import axios from "axios";
import { BASE_URL_API } from "../constants";

const URL = `${BASE_URL_API}/categories`;

type RawCategory = {
  categoryName?: string;
  name?: string;
  category?: string;
  productName?: string;
  displayproductName?: string;
};

const readCategoryName = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const obj = value as RawCategory;
  const candidates = [
    obj.categoryName,
    obj.name,
    obj.category,
    obj.productName,
    obj.displayproductName,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return null;
};

const parseCategoryNames = (data: unknown): string[] => {
  const list: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray((data as { categories?: unknown[] } | null)?.categories)
    ? ((data as { categories?: unknown[] }).categories ?? [])
    : [];

  const unique = new Map<string, string>();
  list.forEach((item) => {
    const parsed = readCategoryName(item);
    if (!parsed) return;
    const key = parsed.toUpperCase();
    if (!unique.has(key)) {
      unique.set(key, parsed);
    }
  });

  return Array.from(unique.values());
};

export const getCategoriesByExternalCompany = async (
  externalCompanyId: number,
  token?: string
): Promise<string[]> => {
  const response = await axios.get(
    `${URL}/external-company/${externalCompanyId}`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined
  );

  return parseCategoryNames(response.data);
};
