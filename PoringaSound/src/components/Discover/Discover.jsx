import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    CircularProgress,
    Typography,
    IconButton,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import SongCard from "./components/SongCard";
import { fetchSongsPreferences } from "../../services/songs";

const Discover = () => {
    const containerRef = useRef(null);
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const loadSongs = async (pageToLoad = 1) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const res = await fetchSongsPreferences(pageToLoad, 5);
            const nuevas = res.canciones.data;
            setSongs((prev) => [...prev, ...nuevas]);
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
        <Box sx={{ position: "relative", height: "calc(100vh - 74px)" }}>
            <Box
                ref={containerRef}
                onScroll={handleScroll}
                sx={{
                    height: "100%",
                    overflowY: "scroll",
                    scrollSnapType: "y mandatory",
                }}
            >
                {songs.map((song, i) => (
                    <SongCard key={song.id} song={song} isActive={i === activeIndex} />
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
                    position: "fixed",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    margin: 2,
                    gap: 2,
                    zIndex: 1000,
                }}
            >
                <IconButton
                    onClick={handlePrev}
                    sx={{
                        backgroundColor: "#333",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#555" },
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
                    }}
                >
                    <ArrowDownward />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Discover;
