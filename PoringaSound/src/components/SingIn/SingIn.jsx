import React, { useState } from "react";
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
import { redirect, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth"; 

const SingIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await loginUser(email, password);
            if (data.token) {
                console.log("Token:", data.token);
                redirect("/home"); 
            }
        } catch (error) {
            setError("Correo electrónico o contraseña incorrectos.");
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
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

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <TextField
                    label="Correo electrónico"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
                    Iniciar Sesión
                </Button>

                <Divider sx={{ my: 2, width: "100%" }}>o</Divider>

                <Button variant="outlined" fullWidth startIcon={<Google />}>
                    Iniciar sesión con Google
                </Button>

                <Typography sx={{ mt: 2 }}>
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                        Regístrate aquí
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SingIn;
