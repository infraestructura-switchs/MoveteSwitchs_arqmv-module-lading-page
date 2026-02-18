import { useState, useEffect } from 'react';

interface CompanyType {
  companyId: number;
  productNameCompany: string;
  logoUrl: string | null;
  numberWhatsapp: number;
  longitude: string;
  latitude: string;
  baseValue: number;
  additionalValue: number;
}

export const useCompanyLocal = () => {
  const [company, setCompany] = useState<CompanyType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  {/* Hook para obtener la información de la empresa

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8080/api/back-whatsapp-qr-app/company/get-company');
        const data = await response.json();
        setCompany(data[0]);
      } catch (err) {
        setError('Error al cargar la información de la empresa');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);
   */}

  return { company, loading, error };
};