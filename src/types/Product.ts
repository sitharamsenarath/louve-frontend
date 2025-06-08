// export interface Product {
//   id: number;
//   title: string;
//   price: number;
//   image_url: string;
// }

import { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  is_active: boolean;
  created_at: Date;
  category: Category;
}