import React from "react";
import {
    Avatar,
    Box,
    Typography,
    Divider,
    IconButton,
    Button
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from "../../context/AuthContext";

const AccountInfo = ({ onEdit }) => {
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_IMAGES_URL;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <Avatar
                        src={user?.imagen_perfil ? apiUrl + user.imagen_perfil : ""}
                        sx={{
                            width: 120,
                            height: 120,
                            border: "3px solid white",
                        }}
                    />
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            {user?.nombre || "Usuario"}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {user?.email || "correo@ejemplo.com"}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Fecha de registro:</strong> {user?.created_at || "N/A"}
                        </Typography>
                    </Box>
                </Box>

                <Button
                    onClick={onEdit}
                    startIcon={<EditIcon />}
                    variant="contained"
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    Editar perfil
                </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>

            </Box>
        </Box>
    );
};

export default AccountInfo;
