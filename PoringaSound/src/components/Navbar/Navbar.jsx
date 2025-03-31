import { useTranslation } from "react-i18next";
import { useState } from "react";
import React from "react";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import InfoDropDown from "./InfoDropDown";
import SearchBar from "./SearchBar";
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
                        <IconButton size="large" aria-label="search" color="inherit">
                            <MenuIcon />
                        </IconButton>
                    </li>
                    <InfoDropDown />
                </div>

                <div className="flex items-center gap-4">
                    <div><IconButton size="large" aria-label="search" color="inherit">
                        <SearchIcon />
                    </IconButton></div>
                    <div className="cursor-pointer"> 
                        <li>
                            <LanguageSwitcher />
                        </li>
                    </div>
                    <li>
                        <Button variant="outlined" onClick={() => setOpen(true)}>
                            {t('Sing In')}
                        </Button>
                        <LoginModal open={open} handleClose={() => setOpen(false)} />
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
