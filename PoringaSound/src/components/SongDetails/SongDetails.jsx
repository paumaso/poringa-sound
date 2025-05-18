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
import Portada from "../LazyImages/Portada";
import LikeButton from "../Interacciones/LikeButton";
import ComentsBox from "../Interacciones/ComentsBox";
import { fetchSongById } from "../../services/songs";
import { useParams } from "react-router-dom";

const SongDetails = ({ onSongClick }) => {
    const { id } = useParams(); // ⬅️ obtenemos el ID desde la URL
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coments, setComents] = useState([]);
    const apiUrl = import.meta.env.VITE_STORAGE_URL;

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchSongById(id);
                setSong(data);
                onSongClick?.(data); // solo si está definido
                setComents(data.comentarios || []);
            } catch (err) {
                console.error("Error al cargar la canción:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

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
                <Portada
                    src={`${apiUrl}${song.portada}`}
                    alt={song.titulo}
                    width="100%"
                    height={240}
                    style={{
                        borderRadius: 8,
                        objectFit: "cover",
                        maxWidth: 240,
                    }}
                    onClick={() => onSongClick?.(song)}
                />

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
