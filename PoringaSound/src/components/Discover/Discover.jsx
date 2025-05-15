import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    CircularProgress,
    Typography,
    IconButton,
} from "@mui/material";
import { getToken } from "../../services/auth";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import SongCard from "./components/SongCard";
import { fetchSongsPreferences, fetchAllSongs } from "../../services/songs";

const Discover = ({ onDetailsClick }) => {
    const containerRef = useRef(null);
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const MAX_VISIBLE = 10;

    const loadSongs = async (pageToLoad = 1) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            let res;
            if (!getToken()) {
                res = await fetchAllSongs(pageToLoad, 5);
            } else {
                res = await fetchSongsPreferences(pageToLoad, 5);
            }

            const nuevas = res.canciones.data;

            setSongs((prev) => {
                const ids = new Set(prev.map(song => song.id));
                const nuevasUnicas = nuevas.filter(song => !ids.has(song.id));
                const actualizadas = [...prev, ...nuevasUnicas];

                const start = Math.max(0, activeIndex - 2);
                return actualizadas.slice(start, start + MAX_VISIBLE);
            });

            setHasMore(res.canciones.next_page_url !== null);
            setPage(pageToLoad);
        } catch (err) {
            console.error("Error al cargar canciones:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSongs(1);
    }, []);

    const handleScroll = (e) => {
        const el = e.target;
        const index = Math.round(el.scrollTop / el.clientHeight);
        setActiveIndex(index);

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
            loadSongs(page + 1);
        }
    };

    const scrollToIndex = (index) => {
        if (containerRef.current) {
            const height = containerRef.current.clientHeight;
            containerRef.current.scrollTo({
                top: index * height,
                behavior: "smooth",
            });
        }
    };

    const handleNext = () => {
        if (activeIndex < songs.length - 1) {
            scrollToIndex(activeIndex + 1);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            scrollToIndex(activeIndex - 1);
        }
    };

    return (
        <Box sx={{ position: "relative", height: "calc(100vh - 72px)", }} >
            <Box
                ref={containerRef}
                onScroll={handleScroll}
                sx={{
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    overflowY: "scroll",
                    scrollSnapType: "y mandatory",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                {songs.map((song, i) => (
                    <SongCard
                        key={`${song.id}-${i}`}
                        song={song}
                        isActive={i === activeIndex}
                        onDetailsClick={onDetailsClick}
                    />
                ))}

                {loading && (
                    <Box
                        sx={{
                            height: "100vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <CircularProgress sx={{ color: "#fff" }} />
                    </Box>
                )}

                {!hasMore && !loading && songs.length === 0 && (
                    <Typography color="white" align="center" mt={4}>
                        No hay canciones disponibles.
                    </Typography>
                )}
            </Box>

            {/* Botones flotantes */}
            <Box
                sx={{
                    position: "absolute",
                    right: 16,
                    top: "45%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: 2,
                    gap: 2,
                    zIndex: 1000,
                    pointerEvents: "none",
                }}
            >
                <IconButton
                    onClick={handlePrev}
                    sx={{
                        backgroundColor: "#333",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#555" },
                        pointerEvents: "auto",

                    }}
                >
                    <ArrowUpward />
                </IconButton>
                <IconButton
                    onClick={handleNext}
                    sx={{
                        backgroundColor: "#333",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#555" },
                        pointerEvents: "auto",
                    }}
                >
                    <ArrowDownward />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Discover;
