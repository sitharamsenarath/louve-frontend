import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import api from "../services/api";

export const useAuth = (onLoginSuccess: (userName: string) => void, onClose: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncUserWithBackend = async (email: string, name: string, provider = "firebase") => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.warn("No authenticated Firebase user");
        return;
    }
    const idToken = await currentUser.getIdToken();
    try {
        await api.post(
            "/v1/users/firebase-sync", 
            {name},
            {
                headers: {
                    Authorization: `Bearer ${idToken}`, 
                },
            }
        );
    } catch (err) {
      console.error("Failed to sync Firebase user", err);
    }
  };

  const syncCurrentUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser?.email) {
      await syncUserWithBackend(currentUser.email, currentUser.displayName || "User");
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userName = userCredential.user.displayName || userCredential.user.email || "User";
      onLoginSuccess(userName);
      await syncCurrentUser();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to login.");
    }
    setLoading(false);
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      const userName = userCredential.user.displayName || userCredential.user.email || "User";
      onLoginSuccess(userName);
      await syncCurrentUser();
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
      await syncCurrentUser();
      onClose();
    } catch (err: any) {
      setError(err.message || "Google login failed.");
    }
    setLoading(false);
  };

  return {
    loading,
    error,
    loginWithEmail,
    signupWithEmail,
    handleGoogleLogin,
  };
};