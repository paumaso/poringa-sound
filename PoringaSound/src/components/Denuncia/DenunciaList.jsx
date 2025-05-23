import React, { useEffect, useState } from "react";
import { fetchDenuncias } from "../../services/denuncias";
import { Pagination, Box, CircularProgress, Typography, Alert } from "@mui/material";
import DenunciaCard from "./DenunciaCard";

const DenunciaList = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const cargarDenuncias = async () => {
    try {
      setLoading(true);
      const { data, meta } = await fetchDenuncias(page);
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
  }, [page]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Denuncias
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
          <Pagination
            sx={{ mt: 3 }}
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </>
      )}
    </Box>
  );
};

export default DenunciaList;
