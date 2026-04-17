import type { CategoryOption } from "../components/CategorySelector";

export const LEGACY_CATEGORY_IMAGE_OPTIONS: CategoryOption[] = [
  { value: "HAMBURGUESAS", label: "Hamburguesa", img: "/assets/icons/hamburguesa.png" },
  { value: "DESGRANADOS", label: "Desgranados", img: "/assets/icons/popular.png" },
  { value: "PERROS", label: "Perros", img: "/assets/icons/combos.png" },
  { value: "CHUZOS", label: "Chuzos", img: "/assets/icons/papitas.png" },
  { value: "ALITAS", label: "Alitas", img: "/assets/icons/popular.png" },
  { value: "CARNES", label: "Carnes", img: "/assets/icons/papitas.png" },
  { value: "AREPAS", label: "Arepas", img: "/assets/icons/popular.png" },
  { value: "GASEOSAS", label: "Gaseosas", img: "/assets/icons/bebida.png" },
  { value: "TOSTADAS", label: "Tostadas", img: "/assets/icons/combos.png" },
  { value: "COMBOS", label: "Combos", img: "/assets/icons/papitas.png" },
  { value: "MAIZITOS", label: "Maizitos", img: "/assets/icons/combos.png" },
  { value: "APLASTADOS", label: "Aplastados", img: "/assets/icons/combos.png" },
  { value: "SANDWICHES", label: "Sandwiches", img: "/assets/icons/combos.png" },
  { value: "PAPAS", label: "Papas", img: "/assets/icons/papitas.png" },
  { value: "ADICIONES", label: "Adiciones", img: "/assets/icons/papitas.png" },
  { value: "JUGOS AGUA", label: "Jugos en agua", img: "/assets/icons/papitas.png" },
  { value: "JUGOS EN LECHE", label: "Jugos en leche", img: "/assets/icons/papitas.png" },
  { value: "FRAPPE AGUA ", label: "Frappe en agua", img: "/assets/icons/papitas.png" },
  { value: "FRAPPE EN LECHE", label: "Frappe en leche", img: "/assets/icons/papitas.png" },
  { value: "JUGOS HIT", label: "Jugos hit", img: "/assets/icons/papitas.png" },
  { value: "MALTEADAS", label: "Malteadas", img: "/assets/icons/bebida.png" },
  { value: "CONSUMO EMPLEADOS", label: "Consumo empleados", img: "/assets/icons/papitas.png" },
];

const normalizeCategoryKey = (value: string): string =>
  value.trim().replace(/\s+/g, " ").toUpperCase();

const normalizeCategoryMatchKey = (value: string): string =>
  normalizeCategoryKey(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const LEGACY_CATEGORY_IMAGE_MAP = new Map<string, string>(
  LEGACY_CATEGORY_IMAGE_OPTIONS.map((option) => [
    normalizeCategoryMatchKey(option.value),
    option.img,
  ])
);

const LEGACY_CATEGORY_IMAGE_ENTRIES = Array.from(LEGACY_CATEGORY_IMAGE_MAP.entries());

export const resolveCategoryImage = (
  categoryName: string,
  categoryImages: Record<string, string>,
  fallbackImage: string
): string => {
  const normalized = normalizeCategoryMatchKey(categoryName);

  const exactLegacy = LEGACY_CATEGORY_IMAGE_MAP.get(normalized);
  if (exactLegacy) return exactLegacy;

  const partialLegacy = LEGACY_CATEGORY_IMAGE_ENTRIES.find(
    ([legacyName]) =>
      normalized.includes(legacyName) || legacyName.includes(normalized)
  )?.[1];
  if (partialLegacy) return partialLegacy;

  return categoryImages[normalizeCategoryKey(categoryName)] || fallbackImage;
};
