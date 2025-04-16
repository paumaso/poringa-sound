import React, { useState } from "react";
import {
  Grid,
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { Google, Login, PhotoCamera } from "@mui/icons-material";
import { registerUser } from "../../services/auth";

const SignUp = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(nombre, email, password, image);
      if (data.token) {
        navigate("/login");
      }
    } catch (error) {
      setError("Correo electrónico o contraseña incorrectos.");
    } finally {
      setLoading(false);
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
        <Grid container spacing={1}>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center", width: "100%" }}>
            Registrarte
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center", width: "100%" }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                label="Nombre"
                fullWidth
                margin="normal"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Grid>

            <Grid item xs={2}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="upload-button-file">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <IconButton
                    color="primary"
                    component="span"
                    sx={{
                      width: "58px",
                      height: "58px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      overflow: "hidden",
                      transition: "background-color 0.3s ease",
                      "&:hover": { backgroundColor: "#e0e0e0" },
                    }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Foto de perfil"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <PhotoCamera sx={{ fontSize: 30 }} />
                    )}
                  </IconButton>
                </div>
              </label>
            </Grid>
          </Grid>

          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            label="Confirmar Contraseña"
            type="password"
            fullWidth
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarte"}
          </Button>

          <Divider sx={{ my: 2, width: "100%" }}>o</Divider>

          <Button variant="outlined" fullWidth startIcon={<Google />}>
            Iniciar sesión con Google
          </Button>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignUp;
