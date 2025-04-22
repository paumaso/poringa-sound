import { useTranslation } from "react-i18next";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from "@mui/material/IconButton";
import LanguageSwitcher from "./LanguageSwitcher";
import InfoDropDown from "./InfoDropDown";
import SearchBar from "./SearchBar";
import MenuDrawer from "./MenuDrawer";
import { Button } from "@mui/material";
import AuthModal from "../Auth/AuthModal";

const Navbar = () => {
    const { t } = useTranslation();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeForm, setActiveForm] = useState("login");

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
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => handleOpenModal("login")}
                        >
                            {t('Sing In')}
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="contained"
                            onClick={() => handleOpenModal("register")}
                        >
                            {t('Sing Up')}
                        </Button>
                    </li>
                </div>
            </ul>

            {/* Modal de Autenticación */}
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