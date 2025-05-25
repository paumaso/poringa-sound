import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, getUser, loginUser, registerUser, logoutUser, getMe } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
          setIsAuthenticated(true);
          sessionStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error("No se pudo obtener el usuario:", error);
          setUser(null);
          setIsAuthenticated(false);
          sessionStorage.removeItem('user');
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('user');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      if (!data || !data.user) throw new Error('Respuesta inválida del servidor');
      setUser(data.user);
      setIsAuthenticated(true);
      sessionStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (nombre, email, password, imagenPerfil) => {
    const { user } = await registerUser(nombre, email, password, imagenPerfil);
    setUser(user);
    setIsAuthenticated(true);
    sessionStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
