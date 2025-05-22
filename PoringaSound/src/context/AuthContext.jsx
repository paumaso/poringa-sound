import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, getUser, loginUser, registerUser, logoutUser } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    setUser(getUser());
  }, []);

  const login = async (email, password) => {
    const { user } = await loginUser(email, password);
    setUser(user);
    setIsAuthenticated(true);
  };

  const register = async (nombre, email, password, imagenPerfil) => {
    const { user } = await registerUser(nombre, email, password, imagenPerfil);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };