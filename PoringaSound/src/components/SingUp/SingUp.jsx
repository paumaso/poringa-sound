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
import { Google, PhotoCamera } from "@mui/icons-material";

const SignUp = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    console.log("Datos del formulario:", { image, password, confirmPassword });
  };

  return (
    <Container maxWidth="xs">
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
          <Typography variant="h5" sx={{ mb: 2 }}>
            Registrarte
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={10}>
              {/* Nombre */}
              <TextField label="Nombre" fullWidth margin="normal" required sx={{ mr: 5 }} />
            </Grid>

            <Grid item xs={2}>
              {/* Foto de Perfil */}
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="upload-button-file">
                <IconButton
                  color="primary"
                  component="span"
                  sx={{
                    width: "100%",
                    height: "57px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    backgroundColor: "#f1f1f1",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Foto de perfil"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <PhotoCamera sx={{ fontSize: 30 }} />
                  )}
                </IconButton>
              </label>
            </Grid>
          </Grid>

          {/* Correo electrónico */}
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            margin="normal"
            required
          />

          {/* Contraseña */}
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Confirmar Contraseña */}
          <TextField
            label="Confirmar Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
            Registrarte
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
