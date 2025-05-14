import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Slider,
} from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";
import LikeButton from "../../Interacciones/LikeButton";
import RatingSong from "../../Interacciones/RatingSong";

const SongCard = ({ song, isActive }) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [isActive]);

    const togglePlay = () => {
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

    const handleSeek = (_, newValue) => {
        audioRef.current.currentTime = newValue;
        setCurrentTime(newValue);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    };

    return (
        <Box
            sx={{
                height: "calc(100vh - 74px)",
                scrollSnapAlign: "start",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#121212",
                px: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 4,
                    backgroundColor: "#1e1e1e",
                    boxShadow: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                    gap: 2,
                }}
            >
                <Box
                    component="img"
                    src={`${apiUrl}${song.portada}`}
                    alt={song.titulo}
                    sx={{
                        width: "100%",
                        height: 360,
                        borderRadius: 2,
                        objectFit: "cover",
                        boxShadow: 3,
                    }}
                />

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" color="white">
                        {song.titulo}
                    </Typography>
                    <Typography variant="subtitle2" color="gray">
                        {song.user?.nombre}
                    </Typography>
                </Box>

                <audio
                    ref={audioRef}
                    src={`${apiUrl}${song.archivo}`}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    hidden
                />

                <Box sx={{ width: "100%" }}>
                    <Slider
                        value={currentTime}
                        max={duration}
                        onChange={handleSeek}
                        sx={{ color: "#90caf9" }}
                    />
                    <Typography variant="caption" color="white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </Typography>
                </Box>

                <IconButton onClick={togglePlay} sx={{ color: "#90caf9" }}>
                    {isPlaying ? (
                        <Pause fontSize="large" />
                    ) : (
                        <PlayArrow fontSize="large" />
                    )}
                </IconButton>

                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <LikeButton
                        songId={song.id}
                        initialLiked={song.has_liked}
                        initialLikeCount={song.likes}
                    />
                    <RatingSong
                        songId={song.id}
                        initialRating={song.puntuacion_usuario}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default SongCard;
