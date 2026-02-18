import type { ProductType } from "../types/productsType";


export const normalizeCategory = (name: string) =>
  (name || "").trim().replace(/\s+/g, " ").toUpperCase();


export const toProductType = (p: any): ProductType => ({
  id: String(p?.id ?? p?.productId ?? ""),        
  arqid: p?.arqProductId != null ? String(p.arqProductId) : "", 
  productName: p?.productName ?? p?.name ?? "",
  price: Number(p?.price ?? 0),
  categoryId: String(p?.categoryId ?? ""),
  comments: Array.isArray(p?.comments) ? p.comments : [],
  information: p?.information ?? undefined,
  category: p?.category ?? undefined,
  preparationTime: typeof p?.preparationTime === "number" ? p.preparationTime : null,
  image: p?.image ?? p?.imgProduct ?? undefined,
  quantity: typeof p?.quantity === "number" ? p.quantity : 1,  
  description: p?.description ?? undefined,
});
