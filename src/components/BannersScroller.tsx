import { useEffect, useRef, useState } from "react";

type Banner = {
  title: string;
  subtitle: string;
  date: string;
  discount: string;
  color: string;
  bg: string;
  image: string;
};

interface BannersScrollerProps {
  banners: Banner[];
}

const scrollDuration = 20;
const scrollStep = 1;

const dup = <T,>(arr: T[]) => [...arr, ...arr];

export const BannersScroller: React.FC<BannersScrollerProps> = ({ banners }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const el = containerRef.current;
    if (el) {
      const scroll = () => {
        if (!el) return;
        el.scrollLeft += scrollStep;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      };
      intervalRef.current = setInterval(scroll, scrollDuration);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isVisible]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 mt-4 relative">
      <div
        ref={containerRef}
        className="flex space-x-8 overflow-x-auto pb-2 scroll-smooth banners-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        {dup(banners).map((banner, idx) => (
          <div
            key={idx}
            className="min-w-[300px] max-w-[320px] h-[140px] flex-shrink-0 rounded-2xl flex items-center px-6 py-4 relative"
            style={{
              background: banner.bg === "#FFE066" ? "#FFE066" : "#FF1C1C",
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
            }}
          >
            {banner.bg === "#FFE066" ? (
              <span
                className="absolute top-4 left-6 bg-[#0099FF] text-white text-xs font-bold px-3 py-1 rounded-full shadow"
                style={{ letterSpacing: 0.5 }}
              >
                Super Aliados
              </span>
            ) : (
              <span
                className="absolute top-4 left-6 bg-[#00C853] text-white text-xs font-bold px-3 py-1 rounded-full shadow"
                style={{ letterSpacing: 0.5 }}
              >
                Nuevo en parrilla
              </span>
            )}
            <div className="flex-1 flex flex-col justify-between h-full pl-0 pt-6">
              <div>
                <div
                  className={`font-bold leading-5 ${
                    banner.bg === "#FFE066"
                      ? "text-black text-lg"
                      : "text-white text-lg"
                  }`}
                >
                  {banner.bg === "#FFE066" ? "Solo por hoy" : "Desde hoy"}
                </div>
                <div
                  className={`text-sm ${
                    banner.bg === "#FFE066" ? "text-black" : "text-white"
                  }`}
                >
                  {banner.bg === "#FFE066"
                    ? "de 2:00 a 6:00 pm"
                    : "Hasta el 28 de febrero"}
                </div>
              </div>
              <span
                className={`mt-1 font-extrabold rounded-lg text-xl ${
                  banner.bg === "#FFE066" ? "text-white" : "text-white"
                } text-center`}
                style={{
                  background: banner.bg === "#FFE066" ? "#FFB300" : "#7B1FFF",
                  color: "#fff",
                  display: "inline-block",
                  minWidth: "unset",
                  width: "110px",
                  padding: "4px 0",
                  margin: 0,
                  lineHeight: 1.2,
                  verticalAlign: "middle",
                  borderRadius: "50px",
                }}
              >
                {banner.discount}
              </span>
            </div>
            <img
              src={banner.image}
              alt="promo"
              className="object-contain ml-4"
              style={{ maxWidth: "50%", height: "auto" }}
            />
          </div>
        ))}
      </div>
      <style>{`.banners-scroll::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};
