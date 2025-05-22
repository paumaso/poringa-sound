import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Typography,
    IconButton,
    Slider,
} from "@mui/material";
import { Pause, PlayArrow, MusicNote } from "@mui/icons-material";
import Portada from "../LazyImages/Portada";
import LikeButton from "../Interacciones/LikeButton";
import RatingSong from "../Interacciones/RatingSong";

const SongCard = ({ song, isActive, onDetailsClick }) => {
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{
                opacity: isActive ? 1 : 0.6,
                y: isActive ? 0 : 20,
                filter: isActive ? "blur(0px)" : "blur(2px)",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ width: "100%" }}
        >
            <Box
                sx={{
                    height: "calc(100vh - 74px)",
                    scrollSnapAlign: "start",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 2,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        opacity: 1,
                        maxWidth: 400,
                        backgroundColor: "#FFFFFF",
                        borderRadius: 4,
                        boxShadow: 12,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 3,
                        gap: 2,
                    }}
                >

                    <Portada
                        src={`${apiUrl}${song.portada}`}
                        alt={song.titulo}
                        width={360}
                        height={360}
                        hover={false}
                        style={{
                            borderRadius: 4,
                            objectFit: "cover",
                        }}
                    />


                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box>
                            <Typography variant="h6" color="text.primary" sx={{
                                cursor: "pointer",
                                transition: "0.5s",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                                onClick={() => onDetailsClick?.(song?.id)}
                            >
                                {song.titulo}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                {song.user?.nombre}
                            </Typography>
                        </Box>

                        <LikeButton
                            songId={song.id}
                            initialLiked={song.has_liked}
                            initialLikeCount={song.total_likes}
                        />
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
                            sx={{ color: "primary.main" }}
                        />
                    </Box>

                    <IconButton onClick={togglePlay} sx={{ color: "primary.main" }}>
                        {isPlaying ? (
                            <Pause fontSize="large" />
                        ) : (
                            <PlayArrow fontSize="large" />
                        )}
                    </IconButton>

                    <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                        <RatingSong
                            songId={song.id}
                            initialRating={song.puntuacion_usuario}
                        />
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

export default SongCard;
