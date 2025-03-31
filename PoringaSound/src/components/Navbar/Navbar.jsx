import { useTranslation } from "react-i18next";
import React from "react";
import MenuIcon from '@mui/icons-material/Menu';
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import InfoDropDown from "./InfoDropDown";
import SearchBar from "./SearchBar";

const Navbar = () => {
    const { t } = useTranslation();
    return (
        <nav className="bg-white shadow-md px-6 py-3">
            <ul className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <li>
                        <a href="#"><MenuIcon className="text-xl text-gray-700" /></a>
                    </li>
                    <InfoDropDown/>
                </div>

                <div className="flex items-center gap-4">
                <div><SearchBar/></div>
                <div className="cursor-pointer" > <li><LanguageSwitcher /></li></div>
                    <li>
                        <a href="/login" className="text-gray-700 hover:text-yellow-500">Sign in</a>
                    </li>
                    <li>
                        <a href="/register" className="text-gray px-4 py-2 rounded-full hover:text-yellow-500">Sign Up</a>
                    </li>
                </div>
            </ul>
        </nav>
    );
};
export default Navbar;
