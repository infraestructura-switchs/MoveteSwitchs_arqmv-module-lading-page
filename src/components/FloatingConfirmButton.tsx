import React, { useEffect, useState } from "react";

type Props = {
  count: number;
  onClick: () => void;
  label?: string;
  /** CSS color string for background (overrides `bgClass` if provided) */
  bgColor?: string;
  /** Optional additional className */
  className?: string;
};

function hexToRgb(hex: string) {
  if (!hex) return null;
  const cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }
  if (cleaned.length === 6 || cleaned.length === 8) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function getContrastColor(hex?: string) {
  const rgb = hexToRgb(hex || "");
  if (!rgb) return "white";
  const { r, g, b } = rgb;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

export default function FloatingConfirmButton({
  count,
  onClick,
  label = "Confirmar pedido",
  bgColor,
  className = "",
}: Props) {
  const [visible, setVisible] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setVisible(count > 0);
  }, [count]);

  useEffect(() => {
    let rafId = 0;
    const handle = () => {
      const y = window.scrollY || 0;
      const newOffset = Math.min(20, y * 0.02);
      setOffset(newOffset);
      rafId = requestAnimationFrame(handle);
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => {
      window.removeEventListener("scroll", handle);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!visible) return null;

  const DEFAULT_BG = "#ef4444";
  const cleanedBg = bgColor && bgColor.toLowerCase() !== "#ffffffff" ? bgColor : undefined;
  const finalBg = cleanedBg || DEFAULT_BG;
  const textColor = getContrastColor(finalBg);
  const badgeTextColor = finalBg;

  return (
    <button
      onClick={onClick}
      aria-label="Confirmar pedido"
      style={{ transform: `translateY(${-offset}px)`, backgroundColor: finalBg, color: textColor }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${className}`}
    >
      <span className="font-semibold">{label}</span>
      <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: "#ffffff", color: badgeTextColor }}>
        {count}
      </span>
    </button>
  );
}
