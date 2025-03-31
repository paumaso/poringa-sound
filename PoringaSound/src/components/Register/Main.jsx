import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const Main = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        tipo: "usuario",
        imagen_perfil: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        setFormData({ ...formData, imagen_perfil: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos enviados:", formData);
        // Aquí llamarías a la API cuando esté lista
    };

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={4}>
                <Typography variant="h4" gutterBottom>
                    Registro de Usuario
                </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                <input
                    accept="image/*"
                    type="file"
                    onChange={handleImageUpload}
                    style={{ margin: "20px 0" }}
                />

                <Button fullWidth variant="contained" color="primary" type="submit">
                    Registrarse
                </Button>
            </form>
        </Container>
    );
};

export default Main;
