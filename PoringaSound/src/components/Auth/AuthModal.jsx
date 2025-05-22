import React, { useState } from "react";
import { Modal, Box, IconButton, Fade, Grow } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import logo from "../../assets/logo.png";

const AuthModal = ({ open, onClose, activeForm, setActiveForm }) => {
    const [fadeIn, setFadeIn] = useState(true);

    const switchForm = (form) => {
        setFadeIn(false);
        setTimeout(() => {
            setActiveForm(form);
            setFadeIn(true);
        }, 300);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    maxWidth: "90%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <img src={logo} alt="Logo" style={{ height: 40 }} />
                    <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ p: 2 }}>
                    <Fade in={fadeIn} timeout={500}>
                        <Grow in={fadeIn} timeout={500}>
                            <div>
                                {activeForm === "register" ? (
                                    <RegisterForm
                                        key="register"
                                        onClose={onClose}
                                        switchToLogin={() => switchForm("login")}
                                    />
                                ) : (
                                    <LoginForm
                                        key="login"
                                        onClose={onClose}
                                        switchToRegister={() => switchForm("register")}
                                    />
                                )}
                            </div>
                        </Grow>
                    </Fade>
                </Box>
            </Box>
        </Modal>
    );
};

export default AuthModal;