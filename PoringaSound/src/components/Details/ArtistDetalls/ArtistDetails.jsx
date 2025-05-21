import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Divider,
    Avatar,
    Stack,
    IconButton,
    Fade,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { fetchUserById } from "../../../services/auth";
import { useParams } from "react-router-dom";
import SongCard from "../../Cards/SongCard";

const ArtistDetails = ({ onSongClick, onDetailsClick }) => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [songsLoading, setSongsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const perPage = 5;
    const apiUrl = import.meta.env.VITE_STORAGE_URL;

    // Carga inicial del artista y canciones
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchUserById(id, page, perPage);
                setArtist(data);
                setSongs(data.canciones?.data || []);
                setPagination(data.canciones);
            } catch (err) {
                console.error("Error al cargar el artista:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) loadData();
        // eslint-disable-next-line
    }, [id]);

    // Solo recarga canciones al cambiar de página
    useEffect(() => {
        if (!artist) return;
        const loadSongs = async () => {
            setSongsLoading(true);
            try {
                const data = await fetchUserById(id, page, perPage);
                setSongs(data.canciones?.data || []);
                setPagination(data.canciones);
            } catch (err) {
                console.error("Error al cargar canciones:", err);
            } finally {
                setSongsLoading(false);
            }
        };
        loadSongs();
        // eslint-disable-next-line
    }, [page]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!artist) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <Typography variant="h6" color="error" align="center">
                    No se pudo cargar el artista.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 1000,
                mx: "auto",
                mt: 4,
                mb: 4,
                px: { xs: 1, sm: 2 },
                minHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Info principal del artista */}
            <Box sx={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                mb: 3
            }}>
                <Avatar
                    src={artist.imagen_perfil ? `${apiUrl}${artist.imagen_perfil}` : undefined}
                    alt={artist.nombre}
                    sx={{ width: 120, height: 120, boxShadow: 2 }}
                />

                <Box sx={{ flex: 1, minWidth: 220, textAlign: "center" }}>
                    <Typography variant="h4" sx={{ wordBreak: "break-word", mb: 1 }}>
                        {artist.nombre}
                    </Typography>
                    <Typography variant="subtitle1">
                        <strong>Canciones activas:</strong> {pagination?.total || 0}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 4, width: "100%" }} />

            <Typography variant="h6" mb={2} align="center">Canciones del artista</Typography>
            <Box
                sx={{
                    width: "100%",
                    bgcolor: "rgba(245,245,250,0.7)",
                    borderRadius: 3,
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <Fade in={songsLoading}>
                    <Box
                        sx={{
                            display: songsLoading ? "flex" : "none",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bgcolor: "rgba(245,245,250,0.7)",
                            zIndex: 2,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </Fade>
                {!songsLoading && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", width: "100%" }}>
                        {songs.length === 0 ? (
                            <Typography variant="body1">Este artista no tiene canciones activas.</Typography>
                        ) : (
                            songs.map((cancion) => (
                                <SongCard
                                    key={cancion.id}
                                    cancion={cancion}
                                    apiUrl={apiUrl}
                                    onSongClick={onSongClick}
                                    onDetailsClick={onDetailsClick}
                                />
                            ))
                        )}
                    </Box>
                )}
            </Box>

            {/* Paginación SIEMPRE visible */}
            <Box
                sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                }}
            >
                <IconButton
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination?.current_page === 1}
                    size="large"
                >
                    <ChevronLeftIcon />
                </IconButton>
                <Typography>
                    Página {pagination?.current_page || 1} de {pagination?.last_page || 1}
                </Typography>
                <IconButton
                    onClick={() => setPage((p) => Math.min((pagination?.last_page || 1), p + 1))}
                    disabled={pagination?.current_page === pagination?.last_page}
                    size="large"
                >
                    <ChevronRightIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ArtistDetails;