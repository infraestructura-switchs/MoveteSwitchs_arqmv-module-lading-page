import axios from 'axios';
import {BASE_URL_API} from '../constants/index';
import {
  ApiResponse,
  SearchParams,
  ProductType,
  SortParams,
  PagedProductsParams,
  PagedProductsResult,
} from '../types/productsType';
import { toProductType } from "../utils/category";
import { getUrlParam } from "../utils/urlParams";

const URL: string = `${BASE_URL_API}/product`;
//const URL: string = `/api/back-whatsapp-qr-app/product`;

export const getProductsByCompany = async (
  token: string,
  externalCompanyId?: number
): Promise<ApiResponse> => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  let id = externalCompanyId;
  if (!id) {
    const cid = getUrlParam("externalCompanyId");
    if (cid) id = Number(cid);
  }
  if (!id) throw new Error("No se encontró externalCompanyId");

  try {
    const response = await axios.get(`${URL}/getProductByCompany/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.debug("productsApi.getProductsByCompany response", response.data);
    return response.data;
  } catch (error) {
    console.error("productsApi.getProductsByCompany failed", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error("Acceso no autorizado. Token inválido o expirado.");
      }
      if (error.response) {
        throw new Error(
          `Error en la solicitud: ${error.response.status} ${error.response.statusText}`
        );
      }
    }
    throw error;
  }
};


export const searchProducts = async ({
  externalCompanyId, name, category, signal,
}: SearchParams): Promise<ProductType[]> => {
  const params: Record<string, string | number> = { externalCompanyId };
  if (name && name.trim() !== '') params.name = name.trim();
  if (category !== undefined && category !== null) {
    if (typeof category === 'number' && !Number.isNaN(category)) {
      params.categoryId = category;
    } else if (typeof category === 'string' && category.trim() !== '') {
      const trimmed = category.trim();
      if (/^\d+$/.test(trimmed)) params.categoryId = Number(trimmed);
      else params.category = trimmed;
    }
  }

  const response = await axios.get(`${URL}/search`, {
    params,
    signal,
  });

  const data = response.data;
  return (Array.isArray(data) ? data : []).map(toProductType);
};

export const getProductsSorted = async ({
  externalCompanyId,
  sort,
  category,
  name,
  signal,
}: SortParams): Promise<ProductType[]> => {
  const params: Record<string, string | number> = { externalCompanyId, sort };
  if (category !== undefined && category !== null) {
    if (typeof category === 'number' && !Number.isNaN(category)) {
      params.categoryId = category;
    } else if (typeof category === 'string' && category.trim() !== '') {
      const trimmed = category.trim();
      if (/^\d+$/.test(trimmed)) params.categoryId = Number(trimmed);
      else params.category = trimmed;
    }
  }
  if (name && name.trim() !== '') params.name = name.trim();

  const response = await axios.get(`${URL}/by-price`, {
    params,
    signal,
  });

  const data = response.data;
  return (Array.isArray(data) ? data : []).map(toProductType);
};

export const getProductsByCompanyPaged = async ({
  token,
  externalCompanyId,
  page,
  size,
  orders = 'ASC',
  sortBy = 'productId',
  category,
  name,
  signal,
}: PagedProductsParams): Promise<PagedProductsResult> => {
  const params: Record<string, string | number> = {
    page,
    size,
    orders,
    sortBy,
  };
  if (category !== undefined && category !== null) {
    if (typeof category === 'number' && !Number.isNaN(category)) {
      params.categoryId = category;
    } else if (typeof category === 'string' && category.trim() !== '') {
      const trimmed = category.trim();
      if (/^\d+$/.test(trimmed)) params.categoryId = Number(trimmed);
      else params.category = trimmed;
    }
  }
  if (name && name.trim() !== '') params.name = name.trim();

  const response = await axios.get(
    `${URL}/getProductByCompany/${externalCompanyId}/paged`,
    {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal,
    }
  );

  const raw = (response.data ?? {}) as Record<string, unknown>;
  const rawContent = raw.content;
  const items = (Array.isArray(rawContent) ? rawContent : []).map(toProductType);

  const pageValue = Number(raw.number ?? page);
  const sizeValue = Number(raw.size ?? size);
  const totalPagesValue = Number(raw.totalPages ?? 0);
  const totalElementsValue = Number(raw.totalElements ?? items.length);

  return {
    items,
    page: Number.isFinite(pageValue) ? pageValue : page,
    size: Number.isFinite(sizeValue) ? sizeValue : size,
    totalPages: Number.isFinite(totalPagesValue) ? totalPagesValue : 0,
    totalElements: Number.isFinite(totalElementsValue) ? totalElementsValue : items.length,
  };
};
