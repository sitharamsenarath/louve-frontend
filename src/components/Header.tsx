import { Box, Flex, Button, Spacer, Text, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

type HeaderProps = {
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
};

const getInitials = (name: string = '') => {
  const [first = '', second = ''] = name.trim().split(' ');
  return (first[0] || '') + (second[0] || '');
};

export default function Header({ isLoggedIn, userName, onLogout, onOpenAuthModal }: HeaderProps) {
  return (
    <Flex
      as="header"
      bg="teal.500"
      color="white"
      align="center"
      padding="1rem 2rem"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Box fontWeight="bold" fontSize="xl">
        MyBrand
      </Box>

      <Spacer />

      {/* Navigation links */}
      <Box display={{ base: 'none', md: 'flex' }} gap="4" mr="6">
        <a href="/">Home</a>
        <a href="/shop">Shop</a>
        <a href="/cart">Cart</a>
      </Box>

      {/* Auth / Account */}
      {isLoggedIn ? (
        <Menu>
          <MenuButton>
            <Flex align="center" gap="2">
              <Avatar size="sm" name={userName} bg="whiteAlpha.300" />
              <Text display={{ base: 'none', md: 'block' }}>{userName}</Text>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Flex gap="4">
          <Button variant="outline" color="white" onClick={() => onOpenAuthModal('login')}>
            Login
          </Button>
          <Button colorScheme="teal" variant="solid" onClick={() => onOpenAuthModal('signup')}>
            Sign Up
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
