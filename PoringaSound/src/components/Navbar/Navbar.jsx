import { useTranslation } from "react-i18next";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from "@mui/material/IconButton";
import LanguageSwitcher from "./components/LanguageSwitcher";
import InfoDropDown from "./components/InfoDropDown";
import SearchBar from "./components/SearchBar";
import MenuDrawer from "./components/MenuDrawer";
import { Button } from "@mui/material";
import AuthModal from "../Auth/AuthModal";
import { useAuth } from "../../context/AuthContext";
import AvatarAccount from "./components/AvatarAccount";

const Navbar = () => {
    const { t } = useTranslation();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeForm, setActiveForm] = useState("login");
    const { isAuthenticated, user, logout, login } = useAuth();

    const handleOpenModal = (formType) => {
        setActiveForm(formType);
        setModalOpen(true);
    };

    return (
        <nav className="bg-white shadow-md px-6 py-3">
            <ul className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <li>
                        <MenuDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
                    </li>
                    <li>
                        <InfoDropDown />
                    </li>
                </div>

                <div className="flex items-center gap-4">
                    <li>
                        <LanguageSwitcher />
                    </li>
                    {isAuthenticated && user ? ( // Verifica que el usuario esté autenticado y que los datos del usuario existan
                        <>
                            <li>
                                <AvatarAccount />
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleOpenModal("login")}
                                >
                                    {t('Sign In')}
                                </Button>
                            </li>
                            <li>
                                <Button
                                    variant="contained"
                                    onClick={() => handleOpenModal("register")}
                                >
                                    {t('Sign Up')}
                                </Button>
                            </li>
                        </>
                    )}
                </div>
            </ul>

            <AuthModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                activeForm={activeForm}
                setActiveForm={setActiveForm}
            />
        </nav>
    );
};

export default Navbar;