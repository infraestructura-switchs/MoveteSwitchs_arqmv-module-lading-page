import { useEffect, useRef, useState } from "react";

export interface CategoryOption {
  value: string;
  label: string;
  img: string; // we can ignore img for the button tabs based on reference, but keep in interface
}

interface CategorySelectorProps {
  options: CategoryOption[];
  active: string;
  onSelect: (value: string) => void;
  primaryColor?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  options,
  active,
  onSelect,
  primaryColor = "#0c71cf",
}) => {
  const categoriesRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full relative overflow-hidden bg-white mt-4 mb-2">
      <div
        ref={categoriesRef}
        className="flex overflow-x-auto whitespace-nowrap hide-scrollbar pb-2"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {options.map((category) => {
          const isActive = active === category.value;
          return (
            <button
              key={category.value}
              onClick={() => onSelect(category.value)}
              className="px-4 py-2 font-medium text-sm transition-all flex-shrink-0"
              style={{
                backgroundColor: isActive ? primaryColor : "transparent",
                color: isActive ? "#ffffff" : "#4b5563",
                borderBottom: isActive
                  ? `2px solid ${primaryColor}`
                  : "2px solid transparent",
                borderBottomColor: isActive ? primaryColor : "transparent"
              }}
            >
              {category.label}
            </button>
          );
        })}
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
