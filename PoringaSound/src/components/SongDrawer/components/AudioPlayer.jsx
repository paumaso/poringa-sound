import React, { useRef, useState } from "react";
import {
    Box,
    IconButton,
    Typography,
    Slider,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const AudioPlayer = ({ song }) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const skipForward = () => {
        const audio = audioRef.current;
        audio.currentTime = Math.min(audio.currentTime + 10, duration);
    };

    const skipBackward = () => {
        const audio = audioRef.current;
        audio.currentTime = Math.max(audio.currentTime - 10, 0);
    };

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
        audioRef.current.volume = newValue;
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (event, newValue) => {
        audioRef.current.currentTime = newValue;
        setCurrentTime(newValue);
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

            {/* Título y artista */}
            <Box sx={{ width: "100%" }}>
                <Typography variant="h6">{song?.titulo || "Sin título"}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    {song?.user?.nombre || "Sin artista"}
                </Typography>
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
