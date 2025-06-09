import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
  onAuthStateChanged,
  getIdToken
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { firebaseSyncUser } from "../api/users";

export const useAuth = (onLoginSuccess: (userName: string) => void, onClose: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
      } else {
        setToken(null);
      }
    });
    return unsubscribe;
  }, []);
  
  const syncUserWithBackend = async (email: string, name: string, provider = "firebase") => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.warn("No authenticated Firebase user");
        return;
    }
    let idToken: string;
    try {
        idToken = await currentUser.getIdToken(true);
    } catch (e) {
        console.warn("Token refresh failed, trying without force refresh");
        idToken = await currentUser.getIdToken();
    }
    setToken(idToken);
    try {
        await firebaseSyncUser(name, idToken);
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
        const user = userCredential.user;

        if (!user) throw new Error("User creation failed");

        await updateProfile(user, { displayName: name });
        const idToken = await getIdToken(user, true);
        await firebaseSyncUser(name, idToken);

        const userName = userCredential.user.displayName || userCredential.user.email || "User";
        onLoginSuccess(userName);
        await syncCurrentUser();
        onClose();
    } catch (err: any) {
        console.error("Signup failed:", err);
        setError(err.message || "Signup failed");
    } finally {
        setLoading(false);
    }
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
    user,
    token,
    loginWithEmail,
    signupWithEmail,
    handleGoogleLogin,
  };
};