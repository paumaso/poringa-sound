import "./i18n"; 
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes/AppRoutes';

import { Button } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App
