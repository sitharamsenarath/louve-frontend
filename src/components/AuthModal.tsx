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
  Spinner,
} from "@chakra-ui/react"; 
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import axios from "axios";
import { auth, googleProvider } from "../services/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onLoginSuccess: (userName: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  const loginWithEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userName = userCredential.user.displayName || userCredential.user.email || "User";
      onLoginSuccess(userName); 

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to login.");
    }
    setLoading(false);
  };

  const signupWithEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser,{
          displayName: name,
        });
      }

      const userName = userCredential.user.displayName || userCredential.user.email || "User";
      onLoginSuccess(userName);

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const userName = result.user.displayName || result.user.email || "User";
      onLoginSuccess(userName);

      onClose();
    } catch (err: any) {
      setError(err.message || "Google login failed.");
    }
    setLoading(false);
  };

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
            onClick={mode === "login" ? loginWithEmail : signupWithEmail}
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
