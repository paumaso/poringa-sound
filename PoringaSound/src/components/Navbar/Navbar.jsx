import { useTranslation } from "react-i18next";
import { useState } from "react";
import React from "react";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import LanguageSwitcher from "./LanguageSwitcher";
import InfoDropDown from "./InfoDropDown";
import SearchBar from "./SearchBar";
import MenuDrawer from "./MenuDrawer";
import LoginModal from "../LoginModal/LoginModal";
import { Button } from "@mui/material";

const Navbar = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    return (
        <nav className="bg-white shadow-md px-6 py-3">
            <ul className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <li>
                        <MenuDrawer />
                    </li>
                    <li>
                        <InfoDropDown />
                    </li>
                </div>

                <div className="flex items-center gap-4">
                    <li>
                        <LanguageSwitcher />
                    </li>
                    <li>
                        <a href="/login">
                            <Button variant="outlined">{t('Sing In')}</Button>
                        </a>
                    </li>
                    <li>
                        <a href="/register"><Button variant="contained">
                            {t('Sing Up')}
                        </Button></a>
                    </li>
                </div>
            </ul>
        </nav>
    );
};
export default Navbar;
