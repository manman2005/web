import React, { createContext, useState, useEffect } from 'react';
import { getToken } from '../auth/authUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // เช็คตอนโหลดแอปว่ามี token ไหม
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
