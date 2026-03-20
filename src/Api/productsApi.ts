import axios from 'axios';
import {BASE_URL_API} from '../constants/index';
import { ApiResponse,SearchParams,ProductType,SortParams} from '../types/productsType';
import { toProductType } from "../utils/category";
import { getUrlParam } from "../utils/urlParams";

const URL: string = `${BASE_URL_API}/product`;
//const URL: string = `/api/back-whatsapp-qr-app/product`;

export const getProductsByCompany = async (
  token: string,
  companyExternalId?: number
): Promise<ApiResponse> => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  let id = companyExternalId;
  if (!id) {
    const cid = getUrlParam("companyExternalId");
    if (cid) id = Number(cid);
  }
  if (!id) throw new Error("No se encontró companyExternalId");

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
  companyExternalId, name, category, signal,
}: SearchParams): Promise<ProductType[]> => {
  const params: Record<string, string | number> = { companyExternalId };
  if (name && name.trim() !== '') params.name = name.trim();
  if (category && category.trim() !== '') params.category = category.trim();

  const response = await axios.get(`${URL}/search`, {
    params,
    signal,
  });

  const data = response.data;
  return (Array.isArray(data) ? data : []).map(toProductType);
};

export const getProductsSorted = async ({
  companyExternalId,
  sort,
  category,
  name,
  signal,
}: SortParams): Promise<ProductType[]> => {
  const params: Record<string, string | number> = { companyExternalId, sort };
  if (category && category.trim() !== '') params.category = category.trim();
  if (name && name.trim() !== '') params.name = name.trim();

  const response = await axios.get(`${URL}/by-price`, {
    params,
    signal,
  });

  const data = response.data;
  return (Array.isArray(data) ? data : []).map(toProductType);
};
