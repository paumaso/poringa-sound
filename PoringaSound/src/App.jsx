import "./i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthProvider } from './context/AuthContext'
import PoringaSound from './pages/PoringaSound';
import { PageProvider } from './context/PageContext'


function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <PageProvider>
          <PoringaSound />
        </PageProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App
