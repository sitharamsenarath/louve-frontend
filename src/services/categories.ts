import api from './api';
import { Category } from '../types/Category';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/v1/categories');
  return response.data;
};
