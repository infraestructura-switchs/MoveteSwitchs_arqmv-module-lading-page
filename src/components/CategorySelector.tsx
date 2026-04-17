import { useRef, useCallback } from "react";

export interface CategoryOption {
  value: string | number;
  id?: number;
  label: string;
  img: string;
}

interface CategorySelectorProps {
  options: CategoryOption[];
  active: string | number;
  onSelect: (value: string | number) => void;
  primaryColor?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  options,
  active,
  onSelect,
  primaryColor = "#f33838",
}) => {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragMoved = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!categoriesRef.current) return;
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.pageX - categoriesRef.current.offsetLeft;
    scrollLeft.current = categoriesRef.current.scrollLeft;
    categoriesRef.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !categoriesRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 3) dragMoved.current = true;
    categoriesRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (categoriesRef.current) categoriesRef.current.style.cursor = "grab";
  }, []);

  return (
    <div className="w-full relative overflow-hidden bg-white mt-4 mb-2 rounded-2xl">
      <div
        ref={categoriesRef}
        className="flex overflow-x-auto whitespace-nowrap hide-scrollbar pb-2"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: "grab",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {options.map((category) => {
          const isActive = typeof active === "number" ? active === category.id : active === category.value;
          return (
            <button
              key={category.value}
              onClick={() => {
                if (!dragMoved.current) onSelect(category.id != null ? category.id : category.value);
              }}
              className="flex flex-col items-center px-4 py-2 font-medium text-sm transition-all flex-shrink-0 gap-1"
              style={{
                backgroundColor: isActive ? primaryColor : "transparent",
                color: isActive ? "#ffffff" : "#4b5563",
                borderBottom: isActive
                  ? `2px solid ${primaryColor}`
                  : "2px solid transparent",
                borderRadius: "10px",
              }}
            >
              {category.img && (
                <img
                  src={category.img}
                  alt={category.label}
                  className="w-8 h-8 object-contain"
                  draggable={false}
                />
              )}
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
