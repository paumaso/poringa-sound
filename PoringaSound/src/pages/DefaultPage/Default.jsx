import Navbar from "../../components/Navbar/Navbar";
import  LanguageSwitcher  from "../../components/Navbar/LanguageSwitcher";
import React, { Component } from "react";
import { useTranslation } from "react-i18next";


const DefaultPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Navbar />
    </div>
  );
}

export default DefaultPage;