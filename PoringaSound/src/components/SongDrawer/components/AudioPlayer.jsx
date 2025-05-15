import React, { useRef, useState, useEffect } from "react";
import {
    Box,
    IconButton,
    Typography,
    Slider,
    Rating,
    Divider,
    CircularProgress,
} from "@mui/material";
import LikeButton from "../../Interacciones/LikeButton";
import RatingSong from "../../Interacciones/RatingSong";
import ComentsBox from "../../Interacciones/ComentsBox";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { fetchSongById, fetchRandomSong } from "../../../services/songs";

const AudioPlayer = ({ songId, onNextSong }) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const audioRef = useRef(null);
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [coments, setComents] = useState([]);

    useEffect(() => {
        const loadSong = async () => {
            setLoading(true);
            try {
                const data = songId
                    ? await fetchSongById(songId)
                    : await fetchRandomSong();
                setSong(data);
                setComents(data.comentarios || []);
                setCurrentTime(0);
                setIsPlaying(false);
            } catch (error) {
                console.error("Error al cargar la canción:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSong();
    }, [songId]);

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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!song) {
        return (
            <Typography color="error" align="center" mt={4}>
                No se pudo cargar la canción.
            </Typography>
        );
    }

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
                position: "relative"
            }}
        >
            {song.portada && (
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

            <Box sx={{ width: "100%" }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {song.titulo || "Sin título"}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {song.user?.nombre || "Sin artista"}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <RatingSong
                            songId={song.id}
                            initialRating={song.puntuacion_usuario}
                        />
                        <LikeButton
                            songId={song.id}
                            initialLiked={song.has_liked}
                            initialLikeCount={song.total_likes}
                        />
                    </Box>
                </Box>
            </Box>

            <audio
                ref={audioRef}
                src={`${apiUrl}${song.archivo}`}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{ display: "none" }}
            />

            <Slider
                value={currentTime}
                max={duration}
                onChange={handleSeek}
                sx={{ width: "100%" }}
            />

            <Typography variant="caption">
                {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={skipBackward}>
                    <SkipPreviousIcon />
                </IconButton>

                <IconButton onClick={togglePlayPause}>
                    {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>

                <IconButton onClick={skipForward}>
                    <SkipNextIcon />
                </IconButton>
            </Box>

            <Divider sx={{ width: "100%", mt: 2 }} />

            <ComentsBox
                songId={song.id}
                coments={coments}
                cancionId={song.id}
                onNewComent={(nuevoComent) => setComents((prev) => [...prev, nuevoComent])}
            />
        </Box>
    );
};


export default AudioPlayer;
