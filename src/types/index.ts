import { CompanyType } from "./companyType";

export interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  category: string;
  image: string;
}


export interface CartItem {
  product: Product;
  quantity: number;
  comment: string;
}

export interface Category {
  id: string;
  productName: string;
  displayproductName: string;
}

