import React from "react";
import {
    Avatar,
    Box,
    Typography,
    Divider,
    IconButton,
    Stack
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from "../../context/AuthContext";

const AccountInfo = ({ onEdit }) => {
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_IMAGES_URL;

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    return (
        <Box sx={{ p: 3, position: 'relative' }}>
            {/* Botón de editar en esquina superior derecha */}
            <IconButton
                onClick={onEdit}
                size="medium"
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                }}
            >
                <EditIcon />
            </IconButton>

            {/* Contenido principal */}
            <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                    src={user?.imagen_perfil ? apiUrl + user.imagen_perfil : ""}
                    sx={{
                        bgcolor: user?.imagen_perfil ? "transparent" : "primary.main",
                        width: 100,
                        height: 100,
                        border: "3px solid",
                        borderColor: 'divider',
                        fontSize: 60,
                    }}
                >
                    {!user?.imagen_perfil && getInitial(user?.nombre)}
                </Avatar>

                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {user?.nombre || "Usuario"}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {user?.email || "correo@ejemplo.com"}
                    </Typography>
                </Box>
            </Stack>

            {/* Divider - esta es la línea que mencionas */}
            <Divider sx={{ my: 2 }} />

            {/* Sección para información adicional */}
            <Box>
            </Box>
        </Box>
    );
};

export default AccountInfo;