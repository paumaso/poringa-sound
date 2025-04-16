import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, logoutUser } from "../services/auth";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken(); 
    setIsAuthenticated(!!token); 
    setLoading(false);
  }, []);

  const login = (token) => {
    Cookies.set('token', token, { expires: 1 }); 
    setIsAuthenticated(true);  
  };

  const logout = () => {
    logoutUser(); 
    setIsAuthenticated(false); 
  };

  if (loading) {
    return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>); 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
