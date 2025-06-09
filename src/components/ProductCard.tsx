import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Product } from "../types/Product";
import { useAuth } from "../hooks/useAuth";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onOpenAuthModal }) => {
  const { user } = useAuth(() => {}, () => {});

  const handleAddToCart = () => {
    if (!user) {
      onOpenAuthModal('login');
    } else {
      onAddToCart(product);
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg="gray.50" _hover={{ shadow: "md" }}>
      <Heading size="sm" mb={2}>
        {product.name}
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={2}>
        {product.description}
      </Text>
      <Text fontWeight="bold" mb={4}>
        ${product.price}
      </Text>
      <Button colorScheme="teal" onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </Box>
  );
};
