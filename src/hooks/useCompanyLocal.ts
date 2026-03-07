import { useState } from 'react';

import { CompanyType } from "../types/companyType";

// The hook returns the same CompanyType that the rest of the app uses.
// previously this file re‑declared the interface; now we import it instead.

export const useCompanyLocal = () => {
  const [company] = useState<CompanyType | null>(null);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

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
