import React from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    Link
} from "@mui/material";
import { Google } from "@mui/icons-material";

const SingIn = () => {
    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    mt: 10,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Iniciar Sesión
                </Typography>

                <TextField label="Correo electrónico" type="email" fullWidth margin="normal" />
                <TextField label="Contraseña" type="password" fullWidth margin="normal" />

                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                    Iniciar Sesión
                </Button>

                <Divider sx={{ my: 2, width: "100%" }}>o</Divider>

                <Button variant="outlined" fullWidth startIcon={<Google />}>
                    Iniciar sesión con Google
                </Button>

                <Typography sx={{ mt: 2 }}>
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                        Inicia sesión aquí
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SingIn;
