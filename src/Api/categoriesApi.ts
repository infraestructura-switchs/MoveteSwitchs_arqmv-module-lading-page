import axios from "axios";
import { BASE_URL_API } from "../constants";

const URL = `${BASE_URL_API}/categories`;

type RawCategory = {
  id?: number;
  categoryId?: number;
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

const readCategoryId = (value: unknown): number | null => {
  if (!value || typeof value !== "object") return null;
  const obj = value as RawCategory;
  const idCandidate = obj.id ?? obj.categoryId;
  if (typeof idCandidate === "number" && Number.isFinite(idCandidate)) return idCandidate;
  if (typeof idCandidate === "string" && /^\d+$/.test(idCandidate)) return Number(idCandidate);
  return null;
};

const parseCategoryItems = (data: unknown): Array<string | { id: number; name: string }> => {
  const list: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray((data as { categories?: unknown[] } | null)?.categories)
    ? ((data as { categories?: unknown[] }).categories ?? [])
    : [];

  const unique = new Map<string, { id?: number; name: string }>();

  list.forEach((item) => {
    const name = readCategoryName(item);
    if (!name) return;
    const key = name.toUpperCase();
    const id = readCategoryId(item);
    const existing = unique.get(key);
    if (!existing) {
      unique.set(key, { id: id ?? undefined, name });
    } else if (existing.id == null && id != null) {
      existing.id = id;
      unique.set(key, existing);
    }
  });

  return Array.from(unique.values()).map((v) => (v.id != null ? { id: v.id, name: v.name } : v.name));
};

export const getCategoriesByExternalCompany = async (
  externalCompanyId: number,
  token?: string
): Promise<Array<string | { id: number; name: string }>> => {
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

  return parseCategoryItems(response.data);
};
