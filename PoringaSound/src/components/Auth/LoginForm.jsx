import React, { useState } from "react";
import { TextField, Button, Typography, Link, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth";

const LoginForm = ({ onClose, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      onClose();
    } catch (error) {
      setError(error.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Typography color="error" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
      )}

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
        <Link component="button" onClick={switchToRegister} sx={{ cursor: "pointer" }}>
          Regístrate
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;