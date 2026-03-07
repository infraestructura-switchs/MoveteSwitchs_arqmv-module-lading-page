import axios from 'axios';
import {BASE_URL_API} from '../constants/index';
import { ApiResponse,SearchParams,ProductType,SortParams} from '../types/productsType';
import { toProductType } from "../utils/category";
import { getCompanyIdFromUrl } from "../components/Cart";

const URL: string = `${BASE_URL_API}/product`;
//const URL: string = `/api/back-whatsapp-qr-app/product`;

export const getProductsByCompany = async (token: string, companyId?: number): Promise<ApiResponse> => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  const id = companyId ?? getCompanyIdFromUrl();
  if (!id) throw new Error("No se encontró companyId");

  try {
    const response = await axios.get(`${URL}/getProductByCompany/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.debug("productsApi.getProductsByCompany response", response.data);
    return response.data;
  } catch (error: any) {
    console.error("productsApi.getProductsByCompany failed", error);
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error("Acceso no autorizado. Token inválido o expirado.");
      }
      throw new Error(`Error en la solicitud: ${error.response.status} ${error.response.statusText}`);
    }
    throw error;
  }
};


export const searchProducts = async ({
  companyId, name, category, signal,
}: SearchParams): Promise<ProductType[]> => {
  const params: any = { companyId };
  if (name && name.trim() !== '') params.name = name.trim();
  if (category && category.trim() !== '') params.category = category.trim();

  const response = await axios.get(`${URL}/search`, {
    params,
    signal,
  });

  const data = response.data;
  return (Array.isArray(data) ? data : []).map(toProductType);
};

export const getProductsSorted = async ({ companyId, sort, category, name, signal }: SortParams): Promise<ProductType[]> => {
  const params: any = { companyId, sort };
  if (category && category.trim() !== '') params.category = category.trim();
  if (name && name.trim() !== '') params.name = name.trim();

  const response = await axios.get(`${URL}/by-price`, {
    params,
    signal,
  });

  const data = response.data;
  return (Array.isArray(data) ? data : []).map(toProductType);
}