import React from "react";

interface SortOptionsProps {
  value: "" | "priceLowToHigh" | "priceHighToLow";
  onChange: (opt: "" | "priceLowToHigh" | "priceHighToLow") => void;
}

export const SortOptions: React.FC<SortOptionsProps> = ({ value, onChange }) => {
  const handle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as "" | "priceLowToHigh" | "priceHighToLow");
  };

  return (
    <div className="flex items-center space-x-2 mt-4 mb-6">
      <span className="text-sm text-gray-500">Ordenar por:</span>
      <select
        value={value}
        onChange={handle}
        className="p-2 border rounded-full w-64 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">Seleccionar</option>
        <option value="priceLowToHigh">Menor precio</option>
        <option value="priceHighToLow">Mayor precio</option>
      </select>
    </div>
  );
};
