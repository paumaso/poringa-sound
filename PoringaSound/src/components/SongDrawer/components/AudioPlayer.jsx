import React, { useRef, useState, useEffect } from "react";
import {
    Box,
    IconButton,
    Typography,
    Slider,
    Rating
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { likeSong, quitarLike, puntuarCancion } from "../../../services/interactions"; 

const AudioPlayer = ({ song }) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const audioRef = useRef(null);
    const [ratingValue, setRatingValue] = useState(song?.puntuacion_usuario || 0);  // Inicializa la puntuación desde la API
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [liked, setLiked] = useState(song?.has_liked || false);  // Inicializa el estado de like desde la API

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Avanza 10 segundos en el audio
    const skipForward = () => {
        const audio = audioRef.current;
        audio.currentTime = Math.min(audio.currentTime + 10, duration);
    };

    // Retrocede 10 segundos en el audio
    const skipBackward = () => {
        const audio = audioRef.current;
        audio.currentTime = Math.max(audio.currentTime - 10, 0);
    };

    // Actualiza el tiempo actual del audio
    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    // Maneja la metadata del audio (como duración)
    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    // Cambia el tiempo de reproducción al mover el slider
    const handleSeek = (event, newValue) => {
        audioRef.current.currentTime = newValue;
        setCurrentTime(newValue);
    };

    const toggleLike = async () => {
        try {
            if (liked) {
                await quitarLike(song.id); 
            } else {
                await likeSong(song.id);
            }
            setLiked((prev) => !prev); 
        } catch (error) {
            console.error("Error al interactuar con like:", error);
        }
    };

    // Maneja la puntuación
    const handleRatingChange = async (event, newValue) => {
        try {
            await puntuarCancion(song.id, newValue); 
            setRatingValue(newValue); 
        } catch (error) {
            console.error("Error al puntuar la canción:", error);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                gap: 2,
                width: "100%",
                maxWidth: "400px",
                margin: "auto",
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
            }}
        >
            {/* Portada */}
            {song?.portada && (
                <Box
                    component="img"
                    src={`${apiUrl}${song.portada}`}
                    alt={song.titulo}
                    sx={{
                        width: "320px",
                        height: "320px",
                        borderRadius: 2,
                        objectFit: "cover",
                    }}
                />
            )}

            {/* Información de la canción */}
            <Box sx={{ width: "100%" }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {song?.titulo || "Sin título"}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {song?.user?.nombre || "Sin artista"}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* Rating de la canción */}
                        <Rating
                            name="song-rating"
                            value={ratingValue}
                            onChange={handleRatingChange}  // Llama a la función para puntuar
                        />
                        {/* Botón de Like */}
                        <IconButton
                            onClick={toggleLike}  // Llama a la función para manejar like
                            color={liked ? "error" : "default"}
                        >
                            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* Controles de audio */}
            <audio
                ref={audioRef}
                src={`${apiUrl}${song.archivo}`}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{ display: "none" }}
            />

            {/* Slider progreso */}
            <Slider
                value={currentTime}
                max={duration}
                onChange={handleSeek}
                sx={{ width: "100%" }}
            />

            {/* Controles de reproducción */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={skipBackward} aria-label="Retroceder 10s">
                    <SkipPreviousIcon />
                </IconButton>

                <IconButton onClick={togglePlayPause} aria-label="Play/Pause">
                    {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>

                <IconButton onClick={skipForward} aria-label="Avanzar 10s">
                    <SkipNextIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default AudioPlayer;
