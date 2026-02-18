import React from 'react';
import { decryptData } from '../utils/ecnrypt'; 

export const useDecryptData = (encryptedData: string | null) => {
  const [decryptedData, setDecryptedData] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!encryptedData) {
      setDecryptedData(''); 
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
    
      const decrypted = decryptData(encryptedData);
      setDecryptedData(decrypted);
    } catch (err) {
      // Manejar errores
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setDecryptedData('');
      console.error("Error desencriptando:", err);
    } finally {
      setLoading(false);
    }
  }, [encryptedData]); 

  return { 
    decryptedData, 
    loading, 
    error 
  };
};