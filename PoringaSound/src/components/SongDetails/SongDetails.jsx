import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Divider,
    Rating,
    Chip,
} from "@mui/material";
import LikeButton from "../Interacciones/LikeButton";
import ComentsBox from "../Interacciones/ComentsBox";
import { fetchSongById } from "../../services/songs";

const SongDetails = ({ onSongClick, songId }) => {
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coments, setComents] = useState([]);

    const apiUrl = import.meta.env.VITE_STORAGE_URL;

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchSongById(songId);
                setSong(data);
                onSongClick(data);
                setComents(data.comentarios || []);
            } catch (err) {
                console.error("Error al cargar la canción:", err);
            } finally {
                setLoading(false);
            }
        };

        if (songId) {
            loadData();
        }
    }, [songId]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!song) {
        return (
            <Typography variant="h6" color="error" align="center" mt={4}>
                No se pudo cargar la canción.
            </Typography>
        );
    }

    return (
        <Paper elevation={3}
            sx={{
                maxWidth: 1000,
                minWidth: 300,
                mx: "auto",
                p: 4,
                mt: 4,
                minHeight: "85vh",
                display: "flex",
                flexDirection: "column",
            }}>
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Box
                    component="img"
                    src={`${apiUrl}${song.portada}`}
                    alt={song.titulo}
                    sx={{
                        width: { xs: "100%", sm: 240 },
                        height: { xs: "auto", sm: 240 },
                        borderRadius: 2,
                        objectFit: "cover",
                    }} />

                <Box sx={{ flex: 1 }}>
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                            }}
                        >
                            <Typography variant="h4" sx={{ wordBreak: "break-word", flex: 1 }}>
                                {song.titulo}
                            </Typography>

                            <LikeButton
                                songId={song.id}
                                initialLiked={song.has_liked}
                                initialLikeCount={song.total_likes}
                            />
                        </Box>
                    </Box>

                    <Typography variant="subtitle1">
                        <strong>Artista:</strong> {song.user?.nombre}
                    </Typography>

                    <Typography variant="subtitle1">
                        <strong>Género:</strong> <Chip label={song.genero?.nombre}></Chip>
                    </Typography>

                    <Typography variant="subtitle1">
                        <strong>Fecha de subida:</strong>{" "}
                        {new Date(song.created_at).toLocaleDateString()}
                    </Typography>

                    <Typography variant="subtitle1">
                        <strong>Estado:</strong>{" "}
                        {song.active ? "Activa" : "Inactiva"}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="subtitle1">
                            <strong>Puntuación media:</strong>
                        </Typography>
                        <Rating
                            value={song.media_puntuacion || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                        />
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <ComentsBox
                songId={song.id}
                coments={coments}
                cancionId={song.id}
                onNewComent={(nuevoComent) => setComents((prev) => [...prev, nuevoComent])}
            />
        </Paper>
    );
};

export default SongDetails;
