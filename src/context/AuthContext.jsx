// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  function login(email, password) {
    const found = USERS.find(u => u.email === email && u.password === password && u.is_active === 1);
    if (found) {
      setUser(found);
      setError('');
      return true;
    }
    setError('Email atau password salah.');
    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
