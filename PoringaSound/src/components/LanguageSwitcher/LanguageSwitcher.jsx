import { useTranslation } from "react-i18next";
import TranslateIcon from "@mui/icons-material/Translate";
import React, { useState } from "react";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false); 
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200 transition"
      >
        <TranslateIcon className="text-gray-700" />
      </button>

      {open && (
        <ul className="absolute left-0 top-12 bg-white shadow-lg border rounded-md py-2 w-32 z-10 transition-opacity duration-200">
          <li>
            <button
              onClick={() => changeLanguage("es")}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
            >
              🇪🇸 {t("es")}
            </button>
          </li>
          <li>
            <button
              onClick={() => changeLanguage("en")}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
            >
              🇺🇸 {t("en")}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
