import React, { useState } from "react";
import {
    Avatar,
    Box,
    Menu,
    MenuItem,
    IconButton,
    Typography,
    Divider,
    ListItemIcon
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";
import { usePage } from "../../../context/PageContext";

const AvatarAccount = () => {
    const { user, logout } = useAuth();
    const { setActivePage } = usePage();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const apiUrl = import.meta.env.VITE_IMAGES_URL;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
    };

    const handleAccountClick = () => {
        handleMenuClose();
        setActivePage("account");
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    return (
        <Box display="flex" alignItems="center">
            <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
            >
                <Avatar
                    src={user?.imagen_perfil ? apiUrl + user.imagen_perfil : ""}
                    alt={user?.nombre || "User"}
                    sx={{
                        bgcolor: user?.imagen_perfil ? "transparent" : "primary.main",
                        width: 40,
                        height: 40,
                        border: "2px solid",
                        borderColor: "white",
                    }}
                >
                    {!user?.imagen_perfil && getInitial(user?.nombre)}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        minWidth: 220,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleAccountClick} sx={{ pt: 2, pb: 2 }}>
                    <Avatar
                        src={user?.imagen_perfil ? apiUrl + user.imagen_perfil : ""}
                        alt={user?.nombre || "User"}
                        sx={{
                            bgcolor: user?.imagen_perfil ? "transparent" : "primary.main",
                            width: 56,
                            height: 56,
                            mr: 2,
                            border: "2px solid",
                            borderColor: "white",
                        }}
                    >
                        {!user?.imagen_perfil && getInitial(user?.nombre)}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {user?.nombre || "Usuario"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.email || "correo@ejemplo.com"}
                        </Typography>
                    </Box>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default AvatarAccount;