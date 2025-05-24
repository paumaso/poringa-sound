import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Box,
  Typography,
  Alert,
  Collapse,
} from "@mui/material";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { getToken } from "../../services/auth";
import { createDenuncia } from "../../services/denuncias";

const DenunciaButton = ({ cancionId, iconStyle = {} }) => {
  const isAuthenticated = !!getToken();
  if (!isAuthenticated) return null;

  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setOpen(false);
    setMotivo("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!motivo.trim()) {
      setError("El motivo no puede estar vacío.");
      return;
    }

    try {
      await createDenuncia({
        cancion_id: cancionId,
        motivo,
      });
      handleClose();
    } catch (err) {
      setError(err?.message || "Error al enviar la denuncia.");
    }
  };

  return (
    <>
      <Tooltip title="Denunciar" arrow>
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="denunciar"
          sx={{
            color: "gray",
            "&:hover": { color: "red" },
            ...iconStyle,
          }}
        >
          <ReportOutlinedIcon sx={iconStyle} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2 }}>
          <Typography variant="h6">Enviar denuncia</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Collapse in={!!error}>
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Collapse>

          <TextField
            label="Motivo"
            multiline
            minRows={4}
            fullWidth
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              if (error) setError("");
            }}
            placeholder="Describe el motivo de la denuncia..."
            variant="outlined"
            autoFocus
            sx={{ mt: 1 }}
          />

          <Button
            onClick={handleSubmit}
            color="error"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Enviar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DenunciaButton;