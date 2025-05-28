import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Divider,
    Rating,
    Chip,
} from "@mui/material";
import Portada from "../../LazyImages/Portada";
import LikeButton from "../../Interacciones/LikeButton";
import ComentsBox from "../../Interacciones/ComentsBox";
import DenunciaButton from "../../Denuncia/DenunciaButton";
import { fetchSongById } from "../../../services/songs";
import { useParams } from "react-router-dom";

const SongDetails = ({ onSongClick }) => {
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coments, setComents] = useState([]);
    const apiUrl = import.meta.env.VITE_STORAGE_URL;

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchSongById(id);
                setSong(data);
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
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!song) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <Typography variant="h6" color="error" align="center">
                    No se pudo cargar la canción.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 900,
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
                    src={`${apiUrl}${song.portada}`}
                    alt={song.titulo}
                    width={240}
                    height={240}
                    style={{
                        borderRadius: 12,
                        objectFit: "cover",
                        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
                        width: "100%",
                        height: "100%",
                        aspectRatio: "1 / 1",
                        maxWidth: 320,
                        minWidth: 140,
                        maxHeight: 320,
                        minHeight: 140,
                    }}
                    sx={{
                        width: { xs: 260, sm: 200, md: 220, lg: 240 },
                        height: { xs: 260, sm: 200, md: 220, lg: 240 },
                        maxWidth: { xs: 320, sm: 200, md: 220, lg: 240 },
                        maxHeight: { xs: 320, sm: 200, md: 220, lg: 240 },
                        minWidth: 140,
                        minHeight: 140,
                        aspectRatio: "1 / 1",
                        margin: "0 auto"
                    }}
                    onClick={() => onSongClick?.(song)}
                />

                <Box sx={{ flex: 1, minWidth: 220, textAlign: "left", m: 2 }}>
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

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LikeButton
                                songId={song.id}
                                initialLiked={song.liked_by_user}
                                initialLikeCount={song.total_likes}
                            />
                            <DenunciaButton cancionId={song.id} />
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

            <Divider sx={{ my: 4, width: "100%" }} />

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
                }}
            >
                <ComentsBox
                    songId={song.id}
                    coments={coments}
                    cancionId={song.id}
                    onNewComent={(nuevoComent) => setComents((prev) => [...prev, nuevoComent])}
                />
            </Box>
        </Box>
    );
};

export default SongDetails;