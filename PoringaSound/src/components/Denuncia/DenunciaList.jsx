import React, { useEffect, useState } from "react";
import { fetchDenuncias, fetchDenunciasPendientes } from "../../services/denuncias";
import { Box, IconButton, Typography, ToggleButton, ToggleButtonGroup, CircularProgress, Alert } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DenunciaCard from "./DenunciaCard";

const DenunciaList = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tipo, setTipo] = useState("todas");

  const cargarDenuncias = async () => {
    try {
      setLoading(true);
      let data, meta;
      if (tipo === "pendientes") {
        ({ data, meta } = await fetchDenunciasPendientes(page));
      } else {
        ({ data, meta } = await fetchDenuncias(page));
      }
      setDenuncias(data);
      setTotalPages(meta?.last_page || 1);
    } catch (err) {
      setError(err.message || "Error al cargar denuncias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDenuncias();
  }, [page, tipo]);

  const handleTipoChange = (_, value) => {
    if (value) {
      setTipo(value);
      setPage(1);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between" }}>
        <ToggleButtonGroup
          value={tipo}
          exclusive
          onChange={handleTipoChange}
          size="small"
        >
          <ToggleButton value="todas">Todas</ToggleButton>
          <ToggleButton value="pendientes">Pendientes</ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            size="small"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ minWidth: 80, textAlign: "center" }}>
            Página {page} de {totalPages}
          </Typography>
          <IconButton
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            size="small"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Denuncias {tipo === "pendientes" && "(Pendientes)"}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : denuncias.length === 0 ? (
        <Typography>No hay denuncias.</Typography>
      ) : (
        <>
          {denuncias.map((denuncia) => (
            <DenunciaCard key={denuncia.id} denuncia={denuncia} onAction={cargarDenuncias} />
          ))}
        </>
      )}
    </Box>
  );
};

export default DenunciaList;