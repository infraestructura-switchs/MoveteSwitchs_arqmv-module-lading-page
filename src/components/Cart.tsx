import React, { useEffect, useState, useCallback } from "react";
import { X, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaMinus } from 'react-icons/fa';
import { Button, CircularProgress } from "@mui/material";
import { CartItem } from "../types/productsType";
import { useDecryptData } from "../hooks/useDecrypt";
import { BASE_URL_API } from '../constants/index';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useLocalStorage } from "../hooks/useLocalStorage";

const URL: string = `${BASE_URL_API}`;
//const URL: string = `/api/back-whatsapp-qr-app`;

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupButtonText, setPopupButtonText] = useState("");
  const [popupAction, setPopupAction] = useState<(() => void) | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("restaurant-cart", []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const tokenParam =
  window.location.search || window.location.hash.split("?")[1] || "";
  const phoneToken = new URLSearchParams(tokenParam).get("userToken") ?? "";
  const mesaToken = new URLSearchParams(tokenParam).get("mesa") ?? "";
  const qrToken = new URLSearchParams(tokenParam).get("qr") ?? "";
  const deliveryToken = new URLSearchParams(tokenParam).get("Delivery") ?? "";
  const authToken = new URLSearchParams(tokenParam).get("token"); 

  console.log("Auth Token:", authToken);

  const {
    decryptedData: phone,
    loading: phoneLoading,
    error: phoneError,
  } = useDecryptData(phoneToken);

  const {
    decryptedData: mesa,
  } = useDecryptData(mesaToken);

  useEffect(() => {
    setCartItems([]);
  }, [setCartItems]);


  const handleSendOrder = useCallback(async () => {
    setLoading(true);

    if (phoneLoading) {
      setPopupMessage("Procesando información... Por favor espera un momento");
      setPopupButtonText("Aceptar");
      setOpenPopup(true);
      setPopupAction(() => () => {
        setOpenPopup(false);
      });
      setLoading(false);
      return;
    }
    if (phoneError) {
      setPopupMessage("Error al procesar tu información de contacto 🤔");
      setPopupButtonText("Aceptar");
      setOpenPopup(true);
      setPopupAction(() => () => {
        setOpenPopup(false);
      });
      setLoading(false);
      return;
    }

    if (!phone) {
      setPopupMessage("No se encontró tu número de WhatsApp 🤔");
      setPopupButtonText("Aceptar");
      setOpenPopup(true);
      setPopupAction(() => () => {
        setOpenPopup(false);
      });
      setLoading(false);
      return;
    }

    const orderItems = items.map((i) => ({
      productId: i.product.id.toString(),
      qty: i.quantity,
      comment: i.comment || "",
    }));

    console.log("Order Items:", orderItems);

    const orderData = {
      phone,
      companyId: getCompanyIdFromUrl(),
      items: orderItems,
      total,
      restaurantTable: mesa,
    };

    const apiUrl =
      qrToken
        ? `${URL}/order`
        : deliveryToken
        ? `${URL}/order-delivery/saveOrder`
        : null;

    if (!apiUrl) {
      setPopupMessage("No se pudo determinar el tipo de pedido.");
      setPopupButtonText("Aceptar");
      setPopupAction(() => () => {
        setOpenPopup(false);
      });
      setOpenPopup(true);
      setLoading(false);
      return;
    }

    const deliveryData = deliveryToken
      ? {
          ...orderData,
          method: "",
          productNameClient: "",
          address: "",
          phoneClient: phone,
          mail: "",
        }
      : orderData;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(deliveryData),
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar el pedido");
      }
      const data = await response.json();
      // Obtener companyId del token desencriptado o del orderData
      let companyId = null;
      if (authToken) {
        try {
          // Decodificar el payload del JWT
          const payload = JSON.parse(atob(authToken.split('.')[1]));
          companyId = payload.companyId;
        } catch (e) {
          console.warn('No se pudo decodificar el token:', e);
        }
      }
      // Fallback si no se pudo decodificar el token
      if (!companyId) {
        companyId = orderData.companyId;
      }
      let whatsappNumber = "573128362367";
      if (companyId === 238) {
        whatsappNumber = "573128362367";
      } else if (companyId === 273) {
        whatsappNumber = "573180389934";
      }
      window.location.href = `https://wa.me/${whatsappNumber}`;
      onClearCart();
      onClose();
    } catch (err) {
      console.error(err);
      setPopupMessage("No se pudo guardar el pedido, el mesero va en camino.");
      setPopupButtonText("Aceptar");
      setPopupAction(() => () => {
        setOpenPopup(false);
      });
      setOpenPopup(true);
    } finally {
      setLoading(false);
    }
  }, [
    items,
    phone,
    mesa,
    qrToken,
    deliveryToken,
    phoneLoading,
    phoneError,
    total,
    onClearCart,
    onClose,
  ]);

  useEffect(() => {
    if (openPopup && popupButtonText === "Ir a WhatsApp") {
      onClearCart();
    }
  }, [openPopup, popupButtonText, onClearCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl rounded-l-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Mi orden</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-red-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Tu carrito está vacío
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.productName}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-800 mb-2">
                        {item.product.productName}
                      </h3>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="ml-2 flex items-center justify-center rounded-full border-2 border-[#db3434] text-[#db3434] hover:bg-[#ffe5d0] transition-colors w-8 h-8"
                        >
                          <FaMinus className="h-4 w-4" />
                        </button>

                        <span className="text-sm font-medium text-gray-700">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="ml-2 flex items-center justify-center rounded-full border-2 border-[#db3434] text-[#db3434] hover:bg-[#ffe5d0] transition-colors w-8 h-8"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-lg font-bold text-black">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="bg-[#ffdc34] py-2 px-4 rounded-full mb-4 max-w-sm mx-auto">
              <div className="flex items-center space-x-2">
                <IoMdInformationCircleOutline className="h-8 w-8" />
                <p className="text-gray-700 text-xs">
                  Al presionar Confirmar pedido, este se te enviará a WhatsApp.
                </p>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4">
                <span className="font-semibold text-gray-800">Resumen</span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-gray-800">{formatPrice(total)}</span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Descuento:</span>
                <span className="text-gray-800">0% ($0)</span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-start mx-4">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={handleSendOrder}
                  disabled={phoneLoading || phoneError !== null}
                  className="py-3 px-6 w-full rounded-full bg-red-500 text-white font-bold text-lg"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : phoneLoading ? (
                    <span>🔄 Procesando...</span>
                  ) : phoneError ? (
                    <span>❌ Error de conexión</span>
                  ) : (
                    <span>Confirmar pedido</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {openPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md text-center">
            <h3 className="text-lg font-semibold">{popupMessage}</h3>
            <div className="mt-4">
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={popupAction || onClose}
                startIcon={popupButtonText === "Ir a WhatsApp" ? <WhatsAppIcon /> : undefined}
              >
                {popupButtonText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function getCompanyIdFromUrl(): number | null {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("companyId");
  return id ? Number(id) : null;
}
