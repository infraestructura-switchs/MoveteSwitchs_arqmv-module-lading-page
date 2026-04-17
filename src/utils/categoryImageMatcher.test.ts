import { resolveCategoryImage } from "./categoryImageMatcher";

describe("categoryImageMatcher.resolveCategoryImage", () => {
  const fallback = "/assets/icons/fallback.png";

  test("returns exact legacy image when category matches exactly", () => {
    const result = resolveCategoryImage("HAMBURGUESAS", {}, fallback);
    expect(result).toBe("/assets/icons/hamburguesa.png");
  });

  test("matches legacy category with contains ignoring case and accents", () => {
    const result = resolveCategoryImage("Jugós en Leche Especial", {}, fallback);
    expect(result).toBe("/assets/icons/papitas.png");
  });

  test("uses categoryImages map when legacy does not match", () => {
    const result = resolveCategoryImage(
      "POSTRES",
      { POSTRES: "/assets/icons/postres.png" },
      fallback
    );
    expect(result).toBe("/assets/icons/postres.png");
  });

  test("falls back when no match exists", () => {
    const result = resolveCategoryImage("SIN CATEGORIA", {}, fallback);
    expect(result).toBe(fallback);
  });
});
