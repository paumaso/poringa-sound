import "./i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthProvider } from './context/AuthContext'
import PoringaSound from './pages/PoringaSound';

import { Button } from '@mui/material';

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <PoringaSound />
      </AuthProvider>
    </React.StrictMode>

  );
}

export default App
