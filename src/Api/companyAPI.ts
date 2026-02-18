import axios from 'axios';
import {BASE_URL_API} from '../constants/index';

const URL: string = `${BASE_URL_API}/company`;
//const URL: string = `/api/back-whatsapp-qr-app/company`;


export const createCompany = async (data: FormData) => {
  try {
    const response = await axios.post(`${URL}/create`, data, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    
    console.log('Respuesta de la API:', response.data);

  } catch (error) {
    console.error('Error al enviar los datos:', error);
  }
};

export const getCompany = async () => {
  try {
    const response = await axios.get(`${URL}/get-company`);
    console.log('Respuesta de la API:', response.data);
    return response.data.length > 0 ? response.data[0] : null; 
  } catch (error) {
    console.error('Error al obtener los datos de la compañía:', error);
  }
};

export const deleteCompany = async (companyId: number) => {
  try {
    const response = await axios.delete(`${URL}/delete/${companyId}`);
    if (response.status === 200) { 
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al eliminar la compañía:', error);
    throw error;
  }
};