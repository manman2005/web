import React, { createContext, useState, useEffect } from 'react';
import { getToken } from '../auth/authUtils';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded && decoded.user) {
          setIsAuthenticated(true);
          setUser(decoded.user);
          setToken(storedToken);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    }
    setIsAuthReady(true);
  }, []);

  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};
