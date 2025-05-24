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
import ComentsBox from "../../Interacciones/ComentsBox";
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
    songsList = null,
    onNext,
    onPrev,
    albumMode = false
}) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const audioRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [songsPage, setSongsPage] = useState(songsList || []);
    const [page, setPage] = useState(1);
    const perPage = 10;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [song, setSong] = useState(null);

    useEffect(() => {
        if (songsList) {
            setSongsPage(songsList);
            setPage(1);
        }
    }, [songsList]);

    const loadSongsPage = async (pageToLoad) => {
        if (songsList) return;
        try {
            setLoading(true);
            const data = await fetchAllSongs({ page: pageToLoad, perPage, ...filters });
            setSongsPage(data.canciones?.data || []);
            setPage(pageToLoad);
        } catch (error) {
            console.error("Error al cargar canciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadSongByIndex = async (index) => {
        if (!songsPage.length || index < 0 || index >= songsPage.length) return;
        if (songsList) {
            setSong(songsPage[index]);
            setCurrentIndex(index);
            setCurrentTime(0);
            setIsPlaying(false);
            setLoading(false);
            return;
        }
        const songId = songsPage[index].id;
        try {
            setLoading(true);
            const data = await fetchSongById(songId);
            setSong(data);
            setCurrentIndex(index);
            setCurrentTime(0);
            setIsPlaying(false);
        } catch (error) {
            console.error("Error al cargar canción:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!songsList) {
            loadSongsPage(1);
        }
    }, [JSON.stringify(filters)]);


    useEffect(() => {
        if (songsPage.length === 0) return;

        if (initialSongId) {
            const idx = songsPage.findIndex((s) => s.id === initialSongId);
            if (idx !== -1) {
                if (!song || song.id !== initialSongId) {
                    loadSongByIndex(idx);
                }
                return;
            }
        }
        if (!song) {
            loadSongByIndex(0);
        }
    }, [songsPage, initialSongId]);

    const nextSong = async () => {
        if (albumMode && onNext) {
            onNext();
            return;
        }
        if (currentIndex + 1 < songsPage.length) {
            loadSongByIndex(currentIndex + 1);
        } else {
            const nextPage = page + 1;
            const data = await fetchAllSongs({ page: nextPage, perPage, ...filters });
            const nextSongs = data.canciones?.data || [];
            if (nextSongs.length > 0) {
                setSongsPage(nextSongs);
                setPage(nextPage);
                loadSongByIndex(0);
            } else {
                const firstPageData = await fetchAllSongs({ page: 1, perPage, ...filters });
                const firstSongs = firstPageData.canciones?.data || [];
                if (firstSongs.length > 0) {
                    setSongsPage(firstSongs);
                    setPage(1);
                    loadSongByIndex(0);
                }
            }
        }
    };

    const prevSong = async () => {
        if (albumMode && onPrev) {
            onPrev();
            return;
        }
        if (currentIndex > 0) {
            loadSongByIndex(currentIndex - 1);
        } else if (page > 1) {
            const prevPage = page - 1;
            try {
                setLoading(true);
                const data = await fetchAllSongs({ page: prevPage, perPage, ...filters });
                if (data.canciones && data.canciones.data.length > 0) {
                    setSongsPage(data.canciones?.data || []);
                    setPage(prevPage);
                    loadSongByIndex(data.canciones.data.length - 1);
                }
            } catch (error) {
                console.error("Error al cargar página anterior:", error);
            } finally {
                setLoading(false);
            }
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
                    <IconButton onClick={prevSong}>
                        <SkipPreviousIcon />
                    </IconButton>
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
                    <IconButton onClick={nextSong}>
                        <SkipNextIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default AudioPlayer;