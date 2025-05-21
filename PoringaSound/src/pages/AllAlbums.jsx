import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AlbumCard from "../components/Cards/AlbumCard";
import Search from "../components/Filters/Serch";
import GeneroSelect from "../components/Filters/GenerosSelect";
import OrdenSelect from "../components/Filters/OrdenSelect";
import DireccionSelect from "../components/Filters/DireccionSelect";
import PaginationBar from "../components/Filters/PaginationBar";
import { fetchAllAlbums } from "../services/albums";

const AllAlbums = ({ onAlbumClick }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [filters, setFilters] = useState({
    titulo: "",
    artista: "",
    genero_id: "",
    orden: "titulo",
    direccion: "asc",
  });
  const [albums, setAlbums] = useState([]);
  const [pagination, setPagination] = useState({ last_page: 1 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 36;
  const apiUrl = import.meta.env.VITE_STORAGE_URL;

  useEffect(() => {
    const loadAlbums = async () => {
      setLoading(true);
      try {
        const data = await fetchAllAlbums({
          ...filters,
          page,
          perPage,
        });
        setAlbums(data.albums?.data || data.data || []);
        setPagination(data.albums || data);
      } catch (e) {
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };
    loadAlbums();
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  return (
    <Box sx={{ px: { xs: 1, md: 4 }, py: 4, maxWidth: 2000, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 3,
          pt: 1,
          px: { xs: 0, md: 1 },
          overflowX: "auto",
          bgcolor: "#fafbfc",
          borderRadius: 3,
          boxShadow: "0 1px 8px 0 rgba(0,0,0,0.04)",
          mb: 3,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Search
          value={filters.titulo}
          onChange={(e) => handleFilterChange("titulo", e.target.value)}
          placeholder="Buscar álbum"
          sx={{
            minWidth: 160,
            maxWidth: 220,
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            flexShrink: 0,
          }}
        />
        <Search
          value={filters.artista}
          onChange={(e) => handleFilterChange("artista", e.target.value)}
          placeholder="Buscar artista"
          sx={{
            minWidth: 140,
            maxWidth: 200,
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            flexShrink: 0,
          }}
        />
        <DireccionSelect
          value={filters.direccion}
          onChange={(e) => handleFilterChange("direccion", e.target.value)}
          sx={{
            minWidth: 120,
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            flexShrink: 0,
          }}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 320,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : albums.length === 0 ? (
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mt: 6 }}
          >
            No hay álbumes que coincidan con los filtros.
          </Typography>
        ) : (
          <Fade in>
            <Grid
              container
              spacing={3}
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              {albums.map((album) => (
                <Grid
                  item
                  key={album.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <AlbumCard
                    album={album}
                    apiUrl={apiUrl}
                    onAlbumClick={onAlbumClick}
                    sx={{
                      width: "100%",
                      maxWidth: 280,
                      borderRadius: 4,
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <PaginationBar
            page={page}
            totalPages={pagination.last_page || 1}
            onPageChange={setPage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AllAlbums;