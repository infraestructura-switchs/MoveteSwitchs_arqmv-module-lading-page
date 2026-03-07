import { useEffect, useRef, useState } from "react";

export interface CategoryOption {
  value: string;
  label: string;
  img: string;
}

interface CategorySelectorProps {
  options: CategoryOption[];
  active: string;
  onSelect: (value: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  options,
  active,
  onSelect,
}) => {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (categoriesRef.current) {
        const scrollLeft = categoriesRef.current.scrollLeft;
        const scrollWidth = categoriesRef.current.scrollWidth;
        const clientWidth = categoriesRef.current.clientWidth;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
      }
    };

    const refCurrent = categoriesRef.current;
    if (refCurrent) {
      refCurrent.addEventListener("scroll", checkScroll);
    }
    checkScroll();
    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const scrollBy = (delta: number) => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      {showLeftArrow && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-1 bg-white rounded-full shadow"
          onClick={() => scrollBy(-200)}
        >
          <span className="sr-only">Scroll left</span>
          &#8249;
        </button>
      )}
      {showRightArrow && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-1 bg-white rounded-full shadow"
          onClick={() => scrollBy(200)}
        >
          <span className="sr-only">Scroll right</span>
          &#8250;
        </button>
      )}
      <div
        ref={categoriesRef}
        className="flex space-x-8 overflow-x-auto pb-2 scroll-smooth categories-scroll whitespace-nowrap"
      >
        {options.map((category) => (
          <div
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${
              active === category.value
                ? "bg-red-500 text-white"
                : "bg-transparent text-gray-700"
            }`}
          >
            <img
              src={category.img}
              alt={category.label}
              className="w-8 h-8 mb-2 object-contain"
            />
            <span className="text-sm font-semibold">{category.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
