import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Rating,
    IconButton,
    Divider,
    Slider,
    Paper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import { fetchSongById } from "../../services/songs";
import { likeSong, quitarLike, puntuarCancion } from "../../services/interactions";

const SongDetails = ({ songId }) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [rating, setRating] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);

    useEffect(() => {
        const loadSong = async () => {
            try {
                setLoading(true);
                const data = await fetchSongById(songId);
                setSong(data);
                setLiked(!!data.has_liked);
                setRating(data.puntuacion_usuario || 0);
            } catch (error) {
                console.error("Error al cargar detalles:", error);
            } finally {
                setLoading(false);
            }
        };

        if (songId) {
            loadSong();
        }
    }, [songId]);

    const toggleLike = async () => {
        try {
            if (liked) {
                await quitarLike(song.id);
            } else {
                await likeSong(song.id);
            }
            setLiked((prev) => !prev);
        } catch (err) {
            console.error("Error al dar like:", err);
        }
    };

    const handleRatingChange = async (e, newValue) => {
        try {
            await puntuarCancion(song.id, newValue);
            setRating(newValue);
        } catch (err) {
            console.error("Error al puntuar:", err);
        }
    };

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (_, value) => {
        audioRef.current.currentTime = value;
        setCurrentTime(value);
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    if (loading) {
        return (
            <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!song) {
        return (
            <Typography variant="h6" color="error" sx={{ mt: 4, textAlign: "center" }}>
                No se pudo cargar la canción.
            </Typography>
        );
    }

    return (
        <Paper elevation={4} sx={{ maxWidth: 600, m: "auto", p: 3, mt: 4 }}>
            {song.portada && (
                <Box
                    component="img"
                    src={`${apiUrl}${song.portada}`}
                    alt="portada"
                    sx={{
                        width: "100%",
                        height: 300,
                        objectFit: "cover",
                        borderRadius: 2,
                        mb: 2,
                    }}
                />
            )}

            <Typography variant="h5" gutterBottom>
                {song.titulo}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
                {song.user?.nombre || "Artista desconocido"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                <Rating
                    name="rating"
                    value={rating}
                    onChange={handleRatingChange}
                    precision={1}
                />
                <IconButton onClick={toggleLike} sx={{ color: liked ? "red" : "gray" }}>
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            </Box>

            <Divider sx={{ my: 3 }} />

            <audio
                ref={audioRef}
                src={`${apiUrl}${song.archivo}`}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={handlePlayPause}>
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>

                <Slider
                    value={currentTime}
                    max={duration}
                    onChange={handleSeek}
                    sx={{ flex: 1 }}
                />
            </Box>

            <Typography variant="caption">
                {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
        </Paper>
    );
};

export default SongDetails;
