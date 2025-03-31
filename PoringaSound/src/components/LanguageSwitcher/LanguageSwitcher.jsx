import { useTranslation } from "react-i18next";
import TranslateIcon from "@mui/icons-material/Translate";
import IconButton from '@mui/material/IconButton';
import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <div className="relative inline-block">
      <IconButton
        size="large"
        aria-label="language switcher"
        color="inherit"
        onClick={handleOpen}
      >
        <TranslateIcon className="text-gray-700" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={() => changeLanguage("es")}>
          🇪🇸 {t("es")}
        </MenuItem>
        <MenuItem onClick={() => changeLanguage("en")}>
          🇺🇸 {t("en")}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
