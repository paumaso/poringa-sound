import React, { useState } from "react";
import { TextField, Button, Typography, Link, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { usePage } from "../../context/PageContext";
import { loginUser } from "../../services/auth";

const LoginForm = ({ onClose, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const { setActivePage } = usePage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      onClose();
      setActivePage("home");
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 422 && error.response.data.errors) {
          const errors = error.response.data.errors;
          setError(
            Object.values(errors)
              .flat()
              .join(" ")
          );
        } else if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Error desconocido.");
        }
      } else {
        setError(error.message || "Credenciales incorrectas.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      <Typography sx={{ mt: 2, textAlign: "center" }}>
        ¿No tienes cuenta?{" "}
        <Link component="button" type="button" onClick={switchToRegister} sx={{ cursor: "pointer" }}>
          Regístrate
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;