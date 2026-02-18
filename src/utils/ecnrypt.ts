import CryptoJS from 'crypto-js';

const fromBase64URL = (base64url: string): string => {
  let base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  while (base64.length % 4) {
    base64 += '=';
  }
  
  return base64;
};

export const decryptData = (encryptedData: string): string => {
  const secretKey = import.meta.env.VITE_ENCRYPT_TOKEN;

  if (!secretKey) {
    throw new Error("VITE_ENCRYPT_TOKEN is undefined. Verifica tu archivo .env");
  }

  try {

    const parts = encryptedData.split('.');
    if (parts.length !== 2) {

      console.log('El token no tiene formato encriptado. Usando como texto plano:', encryptedData);
      return encryptedData;
    }

    const [ivBase64URL, encryptedBase64URL] = parts;

    const ivBase64 = fromBase64URL(ivBase64URL);
    const encryptedBase64 = fromBase64URL(encryptedBase64URL);


    const iv = CryptoJS.enc.Base64.parse(ivBase64);

    const key = CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Base64).substring(0, 32);
    const keyWordArray = CryptoJS.enc.Utf8.parse(key);


    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, keyWordArray, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error("Error al desencriptar: resultado vacío");
    }

    return decryptedString;
  } catch (error) {
    console.error("Error desencriptando:", error);
    let errorMessage = "Error desconocido";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error al desencriptar los datos: ${errorMessage}`);
  }
};