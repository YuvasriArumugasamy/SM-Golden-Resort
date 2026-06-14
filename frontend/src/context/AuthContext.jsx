import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("adminToken"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("adminToken");
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
