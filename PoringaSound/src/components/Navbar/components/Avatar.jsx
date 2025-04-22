import React, { useState } from "react";
import { Avatar, Typography, Box, Menu, MenuItem, IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../../../context/AuthContext";

const Account = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

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

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    return (
        <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={handleMenuOpen}>
                <Avatar
                    src={user?.imagen_perfil || ""}
                    alt={user?.nombre || "User"}
                    sx={{
                        bgcolor: user?.imagen_perfil ? "transparent" : "primary.main",
                        width: 40,
                        height: 40,
                    }}
                >
                    {!user?.imagen_perfil && getInitial(user?.nombre)}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Account;