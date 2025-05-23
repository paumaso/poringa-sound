import { useTranslation } from "react-i18next";
import { useState } from "react";
import LanguageSwitcher from "./components/LanguageSwitcher";
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
                        <MenuDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} onOpenAuthModal={handleOpenModal} />
                    </li>
                </div>

                <div className="flex items-center gap-4">
                    <li>
                        <LanguageSwitcher />
                    </li>
                    {isAuthenticated && user ? (
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
                                    sx={{
                                        fontSize: { xs: "0.8rem", md: "1rem" },
                                        py: { xs: 0.5, md: 1 },
                                        px: { xs: 1.5, md: 3 },
                                    }}
                                >
                                    {t('Sign In')}
                                </Button>
                            </li>
                            <li>
                                <Button
                                    variant="contained"
                                    onClick={() => handleOpenModal("register")}
                                    sx={{
                                        fontSize: { xs: "0.8rem", md: "1rem" },
                                        py: { xs: 0.5, md: 1 },
                                        px: { xs: 1.5, md: 3 },
                                    }}
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