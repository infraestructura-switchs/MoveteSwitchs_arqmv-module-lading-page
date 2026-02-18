import React, { useEffect, useState } from "react";

const LoadingScreen: React.FC = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("companyId");
    setCompanyId(id);
  }, []);

  const getLogoAndStyles = () => {
    switch (companyId) {
      case "238":
        return {
          bgColor: "#ea3737",
          logoSrc: "/assets/image/Logo-chuzo-ivan.png",
          logoSize: "w-100",
          borderColor: "border-white",
        };
      case "273":
        return {
          bgColor: "#F2ECEB",
          logoSrc: "/assets/image/buen-nino-company.png",
          logoSize: "w-87",
          borderColor: "border-black",
        };
      default:
        return {
          bgColor: "#ea3737",
          logoSrc: "/assets/image/Logo-chuzo-ivan.png",
          logoSize: "w-90",
          borderColor: "border-white",
        };
    }
  };

  const { bgColor, logoSrc, logoSize, borderColor } = getLogoAndStyles();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: bgColor }} 
    >
      <img
        src={logoSrc}
        alt="Logo"
        className={`${logoSize} mb-8`}
      />
      <div className="flex justify-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-4 ${borderColor} border-opacity-50`}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
