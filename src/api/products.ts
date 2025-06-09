import { Product } from "../types/Product";
import api from "../services/api";

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>(`/v1/products/active`);
  return response.data;
};

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  const response = await api.get<Product[]>(`/v1/products/bycategory/active/${categoryId}`);
  return response.data;
};
