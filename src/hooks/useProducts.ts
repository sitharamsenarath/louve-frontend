import { useEffect, useState } from 'react';
import { getProducts, getProductsByCategory } from '../api/products';
import { Product } from '../types/Product';

export const useProducts = (categoryId: number | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = categoryId ? await getProductsByCategory(categoryId) : await getProducts();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [categoryId]);

  return { products, loading };
};
