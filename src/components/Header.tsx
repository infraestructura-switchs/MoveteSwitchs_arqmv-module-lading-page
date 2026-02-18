import React, { useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { CompanyType } from "../types/companyType";

const logoImg_chuzo_ivan = "/assets/icons/Logo_chuzo_ivan.png";
const logoImg_buen_nino = "/assets/image/buen-nino-company-logo.png";

interface HeaderProps {
  config: CompanyType;
  cartItemsCount: number;
  onCartToggle: () => void;
  onAdminToggle: () => void;
  isCartOpen: boolean;
  isAdminOpen: boolean;
  style?: React.CSSProperties;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  cartItemsCount,
  onCartToggle,
  onSearchChange,
  searchValue = "",
}) => {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("companyId");
    setCompanyId(id);
  }, []);

  const getLogoAndStyles = () => {
    switch (companyId) {
      case "238":
        return {
          logoSrc: logoImg_chuzo_ivan,
          logoSize: "h-12 sm:h-10 w-auto", 
          bgColor: "#fff",
        };
      case "273":
        return {
          logoSrc: logoImg_buen_nino,
          logoSize: "h-16 sm:h-14 md:h-16 w-auto",
          bgColor: "#fff",
        };
      default:
        return {
          logoSrc: logoImg_chuzo_ivan,
          logoSize: "h-12 sm:h-10 w-auto",
          bgColor: "#fff",
        };
    }
  };

  const { logoSrc, logoSize, bgColor } = getLogoAndStyles();

  const buttonColor = companyId === "238" 
    ? "bg-[#FF0000] hover:bg-[#e60000]" 
    : companyId === "273" 
    ? "bg-[#7CA668] hover:bg-[#6B8B59]"
    : "bg-[#7CA668] hover:bg-[#7CA668]"; 

  return (
    <header
      className="sticky top-0 z-50 text-white shadow-lg"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center h-15 sm:h-20 py-2">
          <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto mb-4 sm:mb-0">
            <img
              src={logoSrc}
              alt={config.productNameCompany}
              className={`${logoSize} object-contain`}
            />
          </div>

          <div className="flex flex-1 justify-center sm:justify-between items-center w-full sm:w-auto sm:space-x-4 mb-4 sm:mb-0">
            <div className="relative w-full sm:max-w-md max-w-lg mx-auto">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#db3434]">
                <Search className="h-5 w-5" />
              </span>

              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar"
                className="w-full pl-10 pr-10 py-2 rounded-full bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#db3434] transition"
                style={{ fontSize: 16 }}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />

              {searchValue && searchValue.length > 0 && (
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => {
                    onSearchChange?.("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-200 transition"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={onCartToggle}
                className={`flex items-center ${buttonColor} transition-colors rounded-full px-4 py-1`}
                style={{ minWidth: 56, minHeight: 40 }}
              >
                <span className="text-white text-base font-bold mr-2">
                  {cartItemsCount}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-white"
                >
                  <path
                    d="M7 7V6a5 5 0 0 1 10 0v1"
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x={4}
                    y={7}
                    width={16}
                    height={13}
                    rx={2}
                    stroke="white"
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
