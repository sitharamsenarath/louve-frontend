import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Button,
  Text,
} from "@chakra-ui/react"; 
import { useAuth } from "../hooks/useAuth"
import { AuthModalProps } from "../types/auth";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { loginWithEmail, signupWithEmail, handleGoogleLogin, loading, error } = useAuth(onLoginSuccess, onClose);


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === "login" ? "Login" : "Sign Up"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {mode === "signup" && (
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              mb={3}
              isDisabled={loading}
            />
          )}
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={3}
            isDisabled={loading}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={3}
            isDisabled={loading}
          />

          {error && (
            <Text color="red.500" mb={3}>
              {error}
            </Text>
          )}

          <Button
            colorScheme="teal"
            onClick={mode === "login" ? () => loginWithEmail(email, password) : () => signupWithEmail(email, password, name)}
            mr={2}
            isLoading={loading}
            loadingText={mode === "login" ? "Logging in" : "Signing up"}
            w="full"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </Button>

          <Button
            mt={4}
            w="full"
            colorScheme="red"
            onClick={handleGoogleLogin}
            isLoading={loading}
            loadingText="Signing in with Google"
          >
            Login with Google
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
