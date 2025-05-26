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
    Tabs,
    Tab,
    Grid,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumIcon from "@mui/icons-material/Album";
import { fetchUserById } from "../../../services/auth";
import { useParams } from "react-router-dom";
import SongCard from "../../Cards/SongCard";
import AlbumCard from "../../Cards/AlbumCard";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./ArtistDetailsAnimations.css";

const ArtistDetails = ({ onSongClick, onAlbumClick, onDetailsClick }) => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [albumsPagination, setAlbumsPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [songsLoading, setSongsLoading] = useState(false);
    const [albumsLoading, setAlbumsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [albumsPage, setAlbumsPage] = useState(1);
    const [tab, setTab] = useState("songs");
    const perPage = 5;
    const apiUrl = import.meta.env.VITE_STORAGE_URL;

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchUserById(id, page, perPage, albumsPage, perPage);
                setArtist(data);
                setSongs(data.canciones?.data || []);
                setPagination(data.canciones);
                setAlbums(data.albums?.data || []);
                setAlbumsPagination(data.albums);
            } catch (err) {
                console.error("Error al cargar el artista:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) loadData();
    }, [id]);

    useEffect(() => {
        if (!artist || tab !== "songs") return;
        const loadSongs = async () => {
            setSongsLoading(true);
            try {
                const data = await fetchUserById(id, page, perPage, albumsPage, perPage);
                setSongs(data.canciones?.data || []);
                setPagination(data.canciones);
            } catch (err) {
                console.error("Error al cargar canciones:", err);
            } finally {
                setSongsLoading(false);
            }
        };
        loadSongs();
    }, [page, tab]);

    useEffect(() => {
        if (!artist || tab !== "albums") return;
        const loadAlbums = async () => {
            setAlbumsLoading(true);
            try {
                const data = await fetchUserById(id, page, perPage, albumsPage, perPage);
                console.log(data)
                setAlbums(data.albums?.data || []);
                setAlbumsPagination(data.albums);
            } catch (err) {
                console.error("Error al cargar álbumes:", err);
            } finally {
                setAlbumsLoading(false);
            }
        };
        loadAlbums();
    }, [albumsPage, tab]);

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
                alignItems: "stretch",
            }}
        >
            {/* Info principal del artista */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 3, md: 5 },
                    alignItems: { xs: "center", md: "flex-start" },
                    justifyContent: "flex-start",
                    width: "100%",
                    mb: 3,
                }}
            >
                <Avatar
                    src={artist.imagen_perfil ? `${apiUrl}${artist.imagen_perfil}` : undefined}
                    alt={artist.nombre}
                    sx={{
                        width: { xs: 120, sm: 140, md: 160 },
                        height: { xs: 120, sm: 140, md: 160 },
                        boxShadow: 2,
                        borderRadius: "50%",
                        margin: { xs: "0 auto", md: 0 },
                        flexShrink: 0,
                        bgcolor: !artist.imagen_perfil ? "primary.main" : undefined,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "3rem",
                    }}
                >
                    {!artist.imagen_perfil && (artist.nombre?.charAt(0).toUpperCase() || "?")}
                </Avatar>

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 220,
                        textAlign: { xs: "center", md: "left" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: { xs: "center", md: "flex-start" },
                        mt: { xs: 2, md: 0 },
                        px: { xs: 0, md: 2 },
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                wordBreak: "break-word",
                                fontWeight: 700,
                                fontSize: { xs: "2rem", sm: "2.5rem" },
                                ml: 1,
                                mb: 0,
                            }}
                        >
                            {artist.nombre}
                        </Typography>
                    </Stack>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Canciones: {pagination?.total || 0}
                    </Typography>
                    {artist.descripcion && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 500 }}>
                            {artist.descripcion}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Divider sx={{ my: 4, width: "100%" }} />

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: 2, alignSelf: "flex-start" }}
            >
                <Tab
                    value="songs"
                    label={
                        <Box display="flex" alignItems="center" gap={1}>
                            <MusicNoteIcon />
                            <Typography>Canciones</Typography>
                        </Box>
                    }
                />
                <Tab
                    value="albums"
                    label={
                        <Box display="flex" alignItems="center" gap={1}>
                            <AlbumIcon />
                            <Typography>Álbumes</Typography>
                        </Box>
                    }
                />
            </Tabs>

            {/* Contenido de las tabs */}
            <Box
                sx={{
                    width: "100%",
                    bgcolor: "rgba(245,245,250,0.7)",
                    borderRadius: 3,
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "center",
                    position: "relative",
                    minHeight: 180,
                }}
            >
                {tab === "songs" && (
                    <>
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
                            <TransitionGroup component={Grid} container spacing={2} justifyContent="flex-start">
                                {songs.length === 0 ? (
                                    <Grid item xs={12}>
                                        <Typography variant="body1" align="center">
                                            Este artista no tiene canciones activas.
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
                                                    onDetailsClick={onDetailsClick}
                                                />
                                            </Grid>
                                        </CSSTransition>
                                    ))
                                )}
                            </TransitionGroup>
                        )}

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
                    </>
                )}

                {tab === "albums" && (
                    <>
                        <Fade in={albumsLoading}>
                            <Box
                                sx={{
                                    display: albumsLoading ? "flex" : "none",
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
                        {!albumsLoading && (
                            <TransitionGroup component={Grid} container spacing={2} justifyContent="flex-start">
                                {albums.length === 0 ? (
                                    <Grid item xs={12}>
                                        <Typography variant="body1" align="center">
                                            Este artista no tiene álbumes.
                                        </Typography>
                                    </Grid>
                                ) : (
                                    albums.map((album) => (
                                        <CSSTransition key={album.id} timeout={250} classNames="song-fade">
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <AlbumCard
                                                    album={album}
                                                    apiUrl={apiUrl}
                                                    onAlbumClick={onAlbumClick}
                                                />
                                            </Grid>
                                        </CSSTransition>
                                    ))
                                )}
                            </TransitionGroup>
                        )}

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
                                onClick={() => setAlbumsPage((p) => Math.max(1, p - 1))}
                                disabled={albumsPagination?.current_page === 1}
                                size="large"
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                            <Typography>
                                Página {albumsPagination?.current_page || 1} de {albumsPagination?.last_page || 1}
                            </Typography>
                            <IconButton
                                onClick={() => setAlbumsPage((p) => Math.min((albumsPagination?.last_page || 1), p + 1))}
                                disabled={albumsPagination?.current_page === albumsPagination?.last_page}
                                size="large"
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ArtistDetails;