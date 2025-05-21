import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import Portada from "../../LazyImages/Portada";
import { fetchAlbumById } from "../../../services/albums";
import SongCard from "../../Cards/SongCard";

const AlbumDetails = ({ onSongClick, onDetailsClick }) => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [songsLoading, setSongsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const perPage = 5;
    const apiUrl = import.meta.env.VITE_STORAGE_URL;

    // Carga inicial del álbum y canciones
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchAlbumById(id, page, perPage);
                setAlbum(data);
                setSongs(data.canciones?.data || []);
                setPagination(data.canciones);
            } catch (err) {
                console.error("Error al cargar el álbum:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) loadData();
        // eslint-disable-next-line
    }, [id]);

    // Solo recarga canciones al cambiar de página
    useEffect(() => {
        if (!album) return;
        const loadSongs = async () => {
            setSongsLoading(true);
            try {
                const data = await fetchAlbumById(id, page, perPage);
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

    if (!album) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <Typography variant="h6" color="error" align="center">
                    No se pudo cargar el álbum.
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
            <Box sx={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                mb: 3
            }}>
                <Portada
                    src={`${apiUrl}${album.portada}`}
                    alt={album.titulo}
                    width={200}
                    height={200}
                    hover={false}
                    style={{
                        borderRadius: 12,
                        objectFit: "cover",
                        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
                        maxWidth: 200,
                        minWidth: 140,
                    }}
                />

                <Box sx={{ flex: 1, minWidth: 220, textAlign: "center" }}>
                    <Typography variant="h4" sx={{ wordBreak: "break-word", mb: 1 }}>
                        {album.titulo}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2} justifyContent="center" mb={1}>
                        <Avatar
                            src={album.user?.imagen_perfil ? `${apiUrl}${album.user.imagen_perfil}` : undefined}
                            alt={album.user?.nombre}
                            sx={{ width: 44, height: 44, boxShadow: 1 }}
                        />
                        <Typography variant="subtitle1">
                            <strong>Autor:</strong> {album.user?.nombre}
                        </Typography>
                    </Stack>
                    <Typography variant="subtitle2" color="text.secondary">
                        <strong>Fecha de creación:</strong>{" "}
                        {album.created_at ? new Date(album.created_at).toLocaleDateString() : "Desconocida"}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        <strong>Canciones:</strong> {pagination?.total || songs.length}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 4, width: "100%" }} />

            <Typography variant="h6" mb={2} align="center">Canciones del álbum</Typography>
            <Box
                sx={{
                    width: "100%",
                    minHeight: 180,
                    bgcolor: "rgba(245,245,250,0.7)",
                    borderRadius: 3,
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Fade in={songsLoading}>
                    <Box sx={{ display: songsLoading ? "flex" : "none", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
                        <CircularProgress />
                    </Box>
                </Fade>
                {!songsLoading && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", width: "100%" }}>
                        {songs.length === 0 ? (
                            <Typography variant="body1">Este álbum no tiene canciones.</Typography>
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

export default AlbumDetails;