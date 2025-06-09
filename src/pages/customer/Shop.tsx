import { Box, Flex, Spinner, SimpleGrid, Heading, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { CategoryList } from '../../components/CategoryList';
import { ProductCard } from '../../components/ProductCard';
import { Product } from '../../types/Product';
import AuthModal from '../../components/AuthModal';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Shop = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const toast = useToast();

  const { categories } = useCategories();
  const { products, loading } = useProducts(selectedCategoryId);

  const { user, token } = useAuth(
    (userName) => {
      toast({
        title: `Welcome, ${userName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setAuthModalOpen(false);
    },
    () => setAuthModalOpen(false) // onClose
  );

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user || !token) {
      openAuthModal('login');
      return;
    }

    try {
      const payload = {
        user_email: user.email,
        product_id: product.id,
        quantity: 1,
        is_active: true,
      };

      console.log(payload)

      await api.post('/v1/cart/items', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      toast({
        title: 'Added to cart',
        description: `${product.name} has been added.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail;
      toast({
        title: 'Error adding to cart',
        description: Array.isArray(errorDetail)
        ? errorDetail.map((e) => e.msg).join(', ')
        : (errorDetail?.message || 'Something went wrong'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex p={6} gap={6}>
      <Box w="250px" borderRight="1px solid #eee" pr={4}>
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </Box>

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
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOpenAuthModal={openAuthModal}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>

      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        mode={authMode}
        onLoginSuccess={(userName) =>
          toast({
            title: `Welcome back, ${userName}!`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        }
      />
    </Flex>
  );
};

export default Shop;
