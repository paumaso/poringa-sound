import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Fade,
  IconButton,
} from "@mui/material";
import SongCard from "../Home/components/SongCard";
import Search from "../Utils/Serch";
import GeneroSelect from "../Utils/GenerosSelect";
import DireccionSelect from "../Utils/DireccionSelect";
import OrdenSelect from "../Utils/OrdenSelect";
import PaginationBar from "../Utils/PaginationBar";
import { fetchAllSongs } from "../../services/songs";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const AllSongs = ({ onSongClick, onDetailsClick }) => {
  const [filters, setFilters] = useState({
    query: "",
    artista: "",
    genero_id: "",
    orden: "nombre",
    direccion: "asc",
  });
  const [songs, setSongs] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 50;
  const apiUrl = import.meta.env.VITE_STORAGE_URL;

  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true);
      try {
        const data = await fetchAllSongs({
          ...filters,
          page,
          perPage,
        });
        setSongs(data.canciones.data || []);
        setPagination(data.canciones);
      } catch (e) {
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    loadSongs();
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      query: "",
      artista: "",
      genero_id: "",
      orden: "nombre",
      direccion: "asc",
    });
  };

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: 1600, mx: "auto" }}>
      {/* Título */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 800,
          mb: 1,
          letterSpacing: 1,
          fontSize: { xs: "2rem", md: "3rem" },
        }}
      >
        🎧 Explora Nuevas Canciones
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        sx={{ mb: 5 }}
      >
        Usa los filtros para encontrar tu próxima obsesión musical.
      </Typography>

      {/* Filtros */}
      <Paper
        elevation={5}
        sx={{
          p: 3,
          mb: 5,
          borderRadius: 4,
          background: "linear-gradient(135deg, #f7f9fc, #eef1f5)",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Search
          value={filters.query}
          onChange={(e) => handleFilterChange("query", e.target.value)}
          placeholder="🔍 Nombre"
          sx={{ minWidth: 200, maxWidth: 300 }}
        />
        <Search
          value={filters.artista}
          onChange={(e) => handleFilterChange("artista", e.target.value)}
          placeholder="🎤 Artista"
          sx={{ minWidth: 200, maxWidth: 280 }}
        />
        <GeneroSelect
          value={filters.genero_id}
          onChange={(e) => handleFilterChange("genero_id", e.target.value)}
          sx={{ minWidth: 160 }}
        />
        <OrdenSelect
          value={filters.orden}
          onChange={(e) => handleFilterChange("orden", e.target.value)}
          sx={{ minWidth: 160 }}
        />
        <DireccionSelect
          value={filters.direccion}
          onChange={(e) => handleFilterChange("direccion", e.target.value)}
          sx={{ minWidth: 160 }}
        />

        {/* Reset */}
        <IconButton
          onClick={resetFilters}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#555",
            "&:hover": {
              color: "#000",
            },
          }}
          title="Restablecer filtros"
        >
          <RestartAltIcon />
        </IconButton>
      </Paper>

      {/* Canciones */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : songs.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mt: 6 }}
        >
          🥲 No hay canciones que coincidan con los filtros.
        </Typography>
      ) : (
        <Fade in>
          <Grid container spacing={3}>
            {songs.map((cancion) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={cancion.id}>
                <SongCard
                  cancion={cancion}
                  apiUrl={apiUrl}
                  onSongClick={onSongClick}
                  onDetailsClick={onDetailsClick}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}

      {/* Paginación */}
      <Box mt={6}>
        <PaginationBar
          page={page}
          totalPages={pagination.last_page}
          onPageChange={setPage}
        />
      </Box>
    </Box>
  );
};

export default AllSongs;
