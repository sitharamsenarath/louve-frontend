import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header';
import AuthModal from './components/AuthModal';

import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import './services/firebase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.displayName || user.email || 'User');
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setIsLoggedIn(false);
    setUserName('');
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <BrowserRouter>
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={handleLogout}
        onOpenAuthModal={openAuthModal}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onLoginSuccess={handleLogin}
      />

      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
