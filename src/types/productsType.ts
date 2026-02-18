export interface ProductType {
  id: number;
  productName: string;
  price: number;
  categoryId: number;
  category?: string;
  image?: string;
  quantity?: number;
  description?: string | null;
  comments: string[];
  status?: string;
  information?: string | null;
  preparationTime?: number | null;
  arqid?: string;
}

export interface CartItem {
  product: ProductType;
  quantity: number;
  comment: string;
}

export type SearchParams = {
  companyId: number;           
  name?: string;              
  category?: string; 
  signal?: AbortSignal;           
};

export type ProductsResponse = Record<string, ProductType[]>;

export interface ApiResponse {
  categories: { categoryName: string; products: ProductType[] }[];
}

export type BackendProductDto = {
  id: number;
  productName?: string; 
  name?: string;        
  price?: number;
  description?: string | null;
  status?: string | null;
  image?: string | null;      
  imgProduct?: string | null; 
  categoryId?: number | null;
  comments: string[];
  information?: string | null;
  preparationTime?: number | null;
};

export interface ApiResponseRaw {
  categories: { categoryName: string; products: BackendProductDto[] }[];
}

export type SortParams = {
  companyId: number;
  sort: 'ASC' | 'DESC';
  category?: string;
  name?: string;          
  signal?: AbortSignal;
};

