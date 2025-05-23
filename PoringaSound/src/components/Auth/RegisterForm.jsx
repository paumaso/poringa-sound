import React, { useState } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import { Alert } from "@mui/material";

import { IconButton } from "@mui/material";
import { Link } from "@mui/material";
import { Grid } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { registerUser } from "../../services/auth";
import { Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { usePage } from "../../context/PageContext";

const RegisterForm = ({ onClose, switchToLogin }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const { setActivePage } = usePage();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenPerfil(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('email', email);
      formData.append('password', password);
      if (imagenPerfil) formData.append('imagen_perfil', imagenPerfil);
      await register(formData);
      onClose?.();
      setActivePage("home");
    } catch (error) {
      setError(error.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{}}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={9}>
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="register-upload-button"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="register-upload-button">
            <IconButton component="span">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                />
              ) : (
                <PhotoCamera />
              )}
            </IconButton>
          </label>
        </Grid>
      </Grid>

      <TextField
        label="Correo electrónico"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrarse"}
      </Button>

      <Typography sx={{ mt: 2, textAlign: "center" }}>
        ¿Ya tienes cuenta?{" "}
        <Link component="button" type="button" onClick={switchToLogin} sx={{ cursor: "pointer" }}>
          Inicia sesión
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterForm;