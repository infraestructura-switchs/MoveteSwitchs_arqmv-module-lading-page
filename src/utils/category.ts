import type { ProductType } from "../types/productsType";


export const normalizeCategory = (name: string) =>
  (name || "").trim().replace(/\s+/g, " ").toUpperCase();


export const toProductType = (p: unknown): ProductType => {
  const obj = (p ?? {}) as Record<string, unknown>;
  const idValue = obj.id ?? obj.productId;
  const categoryIdValue = obj.categoryId;
  const commentsValue = Array.isArray(obj.comments) ? obj.comments : [];
  const parsedId =
    typeof idValue === "number" ? idValue : Number(idValue ?? 0);
  const parsedCategoryId =
    typeof categoryIdValue === "number"
      ? categoryIdValue
      : Number(categoryIdValue ?? 0);
  return {
    id: Number.isFinite(parsedId) ? parsedId : 0,
    arqid: obj.arqProductId != null ? String(obj.arqProductId) : "",
    productName: (obj.productName ?? obj.name ?? "") as string,
    price: Number(obj.price ?? 0),
    categoryId: Number.isFinite(parsedCategoryId) ? parsedCategoryId : 0,
    comments: commentsValue.filter((item) => typeof item === "string") as string[],
    information: (obj.information ?? undefined) as string | undefined,
    category: (obj.category ?? undefined) as string | undefined,
    preparationTime:
      typeof obj.preparationTime === "number" ? obj.preparationTime : null,
    image: (obj.image ?? obj.imgProduct ?? undefined) as string | undefined,
    quantity: typeof obj.quantity === "number" ? obj.quantity : 1,
    description: (obj.description ?? undefined) as string | undefined,
  };
};
