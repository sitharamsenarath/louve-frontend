import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Spinner,
  SimpleGrid,
  Heading,
  Button,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { getCategories } from '../../services/categories';
import { getProducts, getProductsByCategory } from '../../services/products';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';


const Shop: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategoryId ?? undefined);
  }, [selectedCategoryId]);

  const fetchCategories = async () => {
    getCategories()
        .then((data) => setCategories(data))
        .catch((err) => console.error('Failed to fetch categories:', err));
  };


  const fetchProducts = async (categoryId?: number) => {
  setLoading(true);
  try {
    const products = categoryId
      ? await getProductsByCategory(categoryId)
      : await getProducts();
    setProducts(products);
  } catch (err) {
    toast({
      title: 'Error fetching products',
      status: 'error',
      duration: 4000,
      isClosable: true,
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <Flex p={6} gap={6}>
      {/* Sidebar */}
      <Box w="250px" borderRight="1px solid #eee" pr={4}>
        <Heading size="md" mb={4}>
          Categories
        </Heading>
        <Button
          mb={2}
          size="sm"
          variant={selectedCategoryId === null ? 'solid' : 'ghost'}
          colorScheme="teal"
          onClick={() => setSelectedCategoryId(null)}
        >
          All Products
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            mb={2}
            size="sm"
            variant={selectedCategoryId === category.id ? 'solid' : 'ghost'}
            colorScheme="teal"
            onClick={() => setSelectedCategoryId(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </Box>

      {/* Products Grid */}
      <Box flex="1">
        <Heading size="md" mb={4}>
          {selectedCategoryId
            ? `Products in ${categories.find(c => c.id === selectedCategoryId)?.name}`
            : 'All Products'}
        </Heading>

        {loading ? (
          <Spinner size="xl" />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {products.map((product) => (
              <Box
                key={product.id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                bg="gray.50"
                _hover={{ shadow: 'md' }}
              >
                <Heading size="sm" mb={2}>
                  {product.name}
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {product.description}
                </Text>
                <Text fontWeight="bold">${product.price}</Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Flex>
  );
};

export default Shop;
