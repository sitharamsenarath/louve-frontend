import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Image,
  Stack,
  Flex,
  Input,
} from '@chakra-ui/react';
import { Category } from '../../types/Category';
import { getCategories } from '../../api/categories';
import { useEffect, useState } from 'react';


const featuredProducts = [
  {
    id: 1,
    title: 'Stylish Hoodie',
    price: '$49.99',
    image: '/assets/hoodie.jpg',
  },
  {
    id: 2,
    title: 'Denim Jacket',
    price: '$89.99',
    image: '/assets/jacket.jpg',
  },
  {
    id: 3,
    title: 'Running Shoes',
    price: '$69.99',
    image: '/assets/shoes.jpg',
  },
];

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
    getCategories()
        .then((data) => setCategories(data))
        .catch((err) => console.error('Failed to fetch categories:', err));
    }, []);

    return (
        <Box px={{ base: 4, md: 12 }} py={8}>
        {/* Hero Section */}
        <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            mb={16}
            gap={8}
        >
            <Box flex="1">
            <Heading size="2xl" mb={4}>
                Discover Your Style
            </Heading>
            <Text fontSize="lg" mb={6}>
                Shop the latest trends and refresh your wardrobe with our exclusive collection.
            </Text>
            <Button colorScheme="teal" size="lg">
                Shop Now
            </Button>
            </Box>
            <Box flex="1">
            <Image
                src="/assets/hero-fashion.jpg"
                alt="Fashion banner"
                borderRadius="2xl"
                objectFit="cover"
            />
            </Box>
        </Flex>

        {/* Featured Products */}
        <Heading size="lg" mb={6}>
            Featured Products
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={16}>
            {featuredProducts.map((product) => (
            <Box
                key={product.id}
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="sm"
                _hover={{ boxShadow: 'md' }}
            >
                <Image src={product.image} alt={product.title} h="240px" w="100%" objectFit="cover" />
                <Box p={4}>
                <Heading size="md">{product.title}</Heading>
                <Text mt={2} color="gray.600">
                    {product.price}
                </Text>
                <Button mt={4} colorScheme="teal" variant="outline" w="full">
                    View
                </Button>
                </Box>
            </Box>
            ))}
        </SimpleGrid>

        {/* Shop by Category */}
        <Heading size="lg" mb={4}>
            Shop by Category
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={6}>
            {categories.map((category) => (
                <Box
                key={category.id}
                p={6}
                borderWidth="1px"
                borderRadius="xl"
                textAlign="center"
                bg="gray.50"
                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                >
                <Text fontWeight="semibold">{category.name}</Text>
                </Box>
            ))}
        </SimpleGrid>

        {/* Newsletter Signup */}
        <Box bg="gray.100" p={10} borderRadius="2xl" textAlign="center" mb={16}>
            <Heading size="md" mb={2}>
            Subscribe to our newsletter
            </Heading>
            <Text color="gray.600" mb={4}>
            Get updates on new arrivals and special offers.
            </Text>
            <Flex maxW="400px" mx="auto" gap={2}>
            <Input placeholder="Enter your email" />
            <Button colorScheme="teal">Subscribe</Button>
            </Flex>
        </Box>

        {/* Footer */}
        <Box textAlign="center" pt={8} color="gray.500">
            © {new Date().getFullYear()} MyEcommerce. All rights reserved.
        </Box>
        </Box>
    );
}
