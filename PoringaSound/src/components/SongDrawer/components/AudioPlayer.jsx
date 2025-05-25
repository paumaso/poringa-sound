import React, { useRef, useState, useEffect } from "react";
import {
    Box,
    IconButton,
    Typography,
    Slider,
    CircularProgress,
    Tooltip
} from "@mui/material";
import LikeButton from "../../Interacciones/LikeButton";
import RatingSong from "../../Interacciones/RatingSong";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import VolumeControl from "./VolumenControler";
import Portada from "../../LazyImages/Portada";
import { fetchSongById, fetchAllSongs } from "../../../services/songs";

const AudioPlayer = ({
    initialSongId,
    filters = {},
}) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const audioRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [total, setTotal] = useState(0);

    const [song, setSong] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 1;

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            try {
                const data = await fetchAllSongs({ page: 1, perPage, ...filters });
                const canciones = data.canciones?.data || [];
                setSong(canciones[0] || null);
                setPage(1);
                setTotal(data.canciones?.total || canciones.length);
            } catch (error) {
                setSong(null);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [initialSongId, JSON.stringify(filters)]);

    const nextSong = async () => {
        setLoading(true);
        try {
            let nextPage = page + 1;
            if (nextPage > total) nextPage = 1;
            const data = await fetchAllSongs({ page: nextPage, perPage, ...filters });
            const nextSongs = data.canciones?.data || [];
            if (nextSongs.length > 0) {
                setSong(nextSongs[0]);
                setPage(nextPage);
                setCurrentTime(0);
                setIsPlaying(false);
            }
        } finally {
            setLoading(false);
        }
    };

    // Navegación anterior
    const prevSong = async () => {
        if (page <= 1) return;
        setLoading(true);
        try {
            const prevPage = page - 1;
            const data = await fetchAllSongs({ page: prevPage, perPage, ...filters });
            const prevSongs = data.canciones?.data || [];
            if (prevSongs.length > 0) {
                setSong(prevSongs[0]);
                setPage(prevPage);
                setCurrentTime(0);
                setIsPlaying(false);
            }
        } finally {
            setLoading(false);
        }
    };

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

    if (!song || !song.archivo) {
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
                backgroundColor: "#fff",
                position: "relative"
            }}
        >
            <Portada
                src={`${apiUrl}${song.portada}`}
                alt={song.titulo}
                width={300}
                height={300}
                hover={false}
                style={{
                    borderRadius: 2,
                }}
            />

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" noWrap>
                        {song.titulo || "Sin título"}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
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

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    width: "100%",
                    px: 1,
                }}
            >
                <Typography variant="caption" sx={{ m: 2 }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>

                <VolumeControl audioRef={audioRef} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="Anterior canción">
                    <span>
                        <IconButton onClick={prevSong} disabled={page <= 1}>
                            <SkipPreviousIcon />
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title="Retroceder 10 segundos">
                    <IconButton onClick={skipBackward}>
                        <Replay10Icon />
                    </IconButton>
                </Tooltip>

                <IconButton onClick={togglePlayPause} sx={{
                    "&:hover": {
                        color: "primary.main",
                        backgroundColor: "transparent",
                    },
                }}>
                    {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>

                <Tooltip title="Adelantar 10 segundos">
                    <IconButton onClick={skipForward}>
                        <Forward10Icon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Siguiente canción">
                    <span>
                        <IconButton onClick={nextSong}>
                            <SkipNextIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default AudioPlayer;