import React, { useEffect, useRef, useState, useCallback } from "react";
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
import debounce from "lodash.debounce";

const MAX_VISIBLE = 10;

const Discover = ({ onDetailsClick }) => {
    const containerRef = useRef(null);
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const loadSongs = useCallback(async (pageToLoad = 1) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            let res;
            if (!getToken()) {
                res = await fetchAllSongs(pageToLoad, 5);
            } else {
                res = await fetchSongsPreferences(pageToLoad, 5);
            }

            const nuevas = res.canciones?.data || [];

            setSongs((prev) => {
                const ids = new Set(prev.map(song => song.id));
                const nuevasUnicas = nuevas.filter(song => !ids.has(song.id));
                return [...prev, ...nuevasUnicas];
            });

            setHasMore(res.canciones?.next_page_url !== null);
            setPage(pageToLoad);
        } catch (err) {
            console.error("Error al cargar canciones:", err);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]);

    useEffect(() => {
        loadSongs(1);
    }, [loadSongs]);

    const handleScroll = useCallback(
        debounce((e) => {
            const el = e.target;
            const index = Math.round(el.scrollTop / el.clientHeight);
            setActiveIndex(index);

            if (
                el.scrollTop + el.clientHeight >= el.scrollHeight - 100 &&
                !loading &&
                hasMore
            ) {
                loadSongs(page + 1);
            }
        }, 200),
        [page, loading, hasMore, loadSongs]
    );

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
            handleScroll.cancel();
        };
    }, [handleScroll]);

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

    const showEndOverlay = !loading && !hasMore && activeIndex === songs.length - 1;

    return (
        <Box sx={{ position: "relative", height: "calc(100vh - 72px)", bgcolor: "#111" }}>
            <Box
                ref={containerRef}
                sx={{
                    height: "100%",
                    overflowY: "scroll",
                    scrollSnapType: "y mandatory",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    position: "relative",
                }}
            >
                {songs.map((song, i) => (
                    <Box
                        key={`${song.id}-${i}`}
                        sx={{
                            height: "100vh",
                            width: "100%",
                            scrollSnapAlign: "start",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <SongCard
                            song={song}
                            isActive={i === activeIndex}
                            onDetailsClick={onDetailsClick}
                        />
                    </Box>
                ))}

                {loading && (
                    <Box
                        sx={{
                            height: "100vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            zIndex: 10,
                        }}
                    >
                        <CircularProgress sx={{ color: "#fff" }} />
                    </Box>
                )}

                {showEndOverlay && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(0,0,0,0.85)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2000,
                            textAlign: "center",
                            px: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="h4" color="white" fontWeight={700} mb={2}>
                                🎉 ¡Ya has descubierto todas las canciones!
                            </Typography>
                            <Typography color="white" fontSize={18}>
                                Vuelve más tarde para descubrir nuevas canciones.
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Botones de navegación */}
            <Box
                sx={{
                    position: "absolute",
                    right: 16,
                    top: "45%",
                    display: "flex",
                    flexDirection: "column",
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
                    disabled={activeIndex === 0}
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
                    disabled={activeIndex >= songs.length - 1}
                >
                    <ArrowDownward />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Discover;
