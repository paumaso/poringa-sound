// src/components/denuncias/DenunciaActions.jsx
import React from "react";
import { Button, Stack } from "@mui/material";
import { aceptarDenuncia, rechazarDenuncia } from "../../services/denuncias";

const DenunciaActions = ({ id, onAction }) => {
  const handleAceptar = async () => {
    await aceptarDenuncia(id);
    onAction();
  };

  const handleRechazar = async () => {
    await rechazarDenuncia(id);
    onAction();
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" color="success" onClick={handleAceptar}>
        Aceptar
      </Button>
      <Button variant="outlined" color="error" onClick={handleRechazar}>
        Rechazar
      </Button>
    </Stack>
  );
};

export default DenunciaActions;
