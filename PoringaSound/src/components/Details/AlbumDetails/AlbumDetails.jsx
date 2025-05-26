import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    Divider,
    Avatar,
    Stack,
    IconButton,
    Fade,
    Grid,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Portada from "../../LazyImages/Portada";
import { fetchAlbumById } from "../../../services/albums";
import SongCard from "../../Cards/SongCard";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./AlbumDetailsAnimations.css";

const AlbumDetails = ({ onSongClick, onAlbumClick }) => {
    const { id } = useParams();
    const navigate = useNavigate();
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
    }, [id]);

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

    const artistInitial = album.user?.nombre?.charAt(0).toUpperCase() || "?";

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
                alignItems: "stretch",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    alignItems: { xs: "center", md: "flex-start" },
                    justifyContent: "flex-start",
                    width: "100%",
                    mb: 3,
                }}
            >
                <Portada
                    src={`${apiUrl}${album.portada}`}
                    alt={album.titulo}
                    width={200}
                    height={200}
                    style={{
                        borderRadius: 12,
                        objectFit: "cover",
                        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
                        maxWidth: 200,
                        minWidth: 140,
                    }}
                    onClick={() => onAlbumClick && onAlbumClick(album.id)}
                />

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 220,
                        textAlign: { xs: "center", md: "left" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: { xs: "center", md: "flex-start" },
                    }}
                >
                    <Typography variant="h4" sx={{ wordBreak: "break-word", mb: 1, fontWeight: 700 }}>
                        {album.titulo}
                    </Typography>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        justifyContent={{ xs: "center", md: "flex-start" }}
                        mb={1}
                        sx={{ width: "100%" }}
                    >
                        <Avatar
                            src={album.user?.imagen_perfil ? `${apiUrl}${album.user.imagen_perfil}` : undefined}
                            alt={album.user?.nombre}
                            sx={{
                                width: 44,
                                height: 44,
                                boxShadow: 1,
                                bgcolor: !album.user?.imagen_perfil ? "primary.main" : undefined,
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "1.3rem",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate(`/artist/${album.user?.id}`)}
                        >
                            {!album.user?.imagen_perfil && artistInitial}
                        </Avatar>
                        <Typography variant="subtitle1">
                            <strong>Autor:</strong> {album.user?.nombre}
                        </Typography>
                    </Stack>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: { xs: "center", md: "left" } }}>
                        <strong>Fecha de creación:</strong>{" "}
                        {album.created_at ? new Date(album.created_at).toLocaleDateString() : "Desconocida"}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: { xs: "center", md: "left" } }}>
                        <strong>Canciones:</strong> {pagination?.total || songs.length}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 4, width: "100%" }} />

            <Typography variant="h6" mb={2} align="left" sx={{ fontWeight: 600 }}>
                Canciones del álbum
            </Typography>
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
                    alignItems: "stretch",
                    justifyContent: "center",
                }}
            >
                <Fade in={songsLoading}>
                    <Box sx={{ display: songsLoading ? "flex" : "none", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
                        <CircularProgress />
                    </Box>
                </Fade>
                {!songsLoading && (
                    <TransitionGroup component={Grid} container spacing={2} justifyContent="flex-start">
                        {songs.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography variant="body1" align="center">
                                    Este álbum no tiene canciones.
                                </Typography>
                            </Grid>
                        ) : (
                            songs.map((cancion) => (
                                <CSSTransition key={cancion.id} timeout={250} classNames="song-fade">
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <SongCard
                                            cancion={cancion}
                                            apiUrl={apiUrl}
                                            onSongClick={onSongClick}
                                        />
                                    </Grid>
                                </CSSTransition>
                            ))
                        )}
                    </TransitionGroup>
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