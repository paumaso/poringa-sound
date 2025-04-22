import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, logoutUser, loginUser, registerUser } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    const userData = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    if (token) {
      setIsAuthenticated(true);
      setUser(userData);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { user } = await loginUser(email, password); 
      sessionStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const register = async (nombre, email, password, imagenPerfil) => {
    try {
      const { user } = await registerUser(nombre, email, password, imagenPerfil); 
      sessionStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error("Error al registrar:", error);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };