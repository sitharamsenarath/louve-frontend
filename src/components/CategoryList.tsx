import { Button, Heading } from "@chakra-ui/react";
import { Category } from "../types/Category";

export const CategoryList = ({
  categories,
  selectedCategoryId,
  onSelect,
}: {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (id: number | null) => void;
}) => (
  <>
    <Heading size="md" mb={4}>Categories</Heading>
    <Button
      mb={2}
      size="sm"
      variant={selectedCategoryId === null ? 'solid' : 'ghost'}
      colorScheme="teal"
      onClick={() => onSelect(null)}
    >
      All Products
    </Button>
    {categories.map((cat) => (
      <Button
        key={cat.id}
        mb={2}
        size="sm"
        variant={selectedCategoryId === cat.id ? 'solid' : 'ghost'}
        colorScheme="teal"
        onClick={() => onSelect(cat.id)}
      >
        {cat.name}
      </Button>
    ))}
  </>
);
