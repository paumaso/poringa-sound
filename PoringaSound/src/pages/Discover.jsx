import React, { useEffect, useState, useCallback } from "react";
import { Box, CircularProgress, Fade, Typography, IconButton } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import SongCard from "../components/Discover/SongCard";
import { fetchDiscoverSongs } from "../services/songs";
import { FixedSizeList as List } from "react-window";

const ITEM_HEIGHT = window.innerHeight;

const Discover = ({ onDetailsClick }) => {
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const loadSongs = useCallback(async (pageToLoad = 1) => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await fetchDiscoverSongs(pageToLoad, 5);
            const nuevas = res.canciones?.data || [];
            setSongs(prev => [...prev, ...nuevas]);
            setHasMore(res.canciones?.next_page_url !== null);
            setPage(pageToLoad);
        } catch (err) {
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]);

    useEffect(() => {
        loadSongs(1);
    }, []);

    const listRef = React.useRef();

    const handleNext = () => {
        if (activeIndex < songs.length - 1) {
            setActiveIndex(activeIndex + 1);
            listRef.current?.scrollToItem(activeIndex + 1, "start");
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
            listRef.current?.scrollToItem(activeIndex - 1, "start");
        }
    };

    const handleItemsRendered = ({ visibleStopIndex }) => {
        if (
            hasMore &&
            !loading &&
            visibleStopIndex >= songs.length - 2
        ) {
            loadSongs(page + 1);
        }
        setActiveIndex(visibleStopIndex);
    };

    return (
        <Box sx={{ position: "relative", bgcolor: "#111" }}>
            <List
                height={window.innerHeight - 72}
                itemCount={songs.length}
                itemSize={ITEM_HEIGHT}
                width={"100%"}
                ref={listRef}
                onItemsRendered={handleItemsRendered}
                style={{ scrollSnapType: "y mandatory", overflowX: "hidden" }}
            >
                {({ index, style }) => (
                    <Box
                        key={songs[index]?.id || index}
                        style={style}
                        sx={{
                            width: "100%",
                            scrollSnapAlign: "start",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                        }}
                    >
                        <SongCard
                            song={songs[index]}
                            isActive={index === activeIndex}
                            onDetailsClick={onDetailsClick}
                        />
                    </Box>
                )}
            </List>

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

            {!hasMore && songs.length > 0 && (
                <Box
                    sx={{
                        height: "100vh",
                        width: "100%",
                        scrollSnapAlign: "start",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0,0,0,0.7)",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 20,
                    }}
                >
                    <Fade in>
                        <Box textAlign="center">
                            <Typography variant="h4" color="white" fontWeight={700} mb={2}>
                                ¡Ya has visto todas las canciones!
                            </Typography>
                            <Typography color="white" fontSize={18}>
                                Vuelve más tarde para descubrir nuevas canciones.
                            </Typography>
                        </Box>
                    </Fade>
                </Box>
            )}

            {/* Botones flotantes */}
            <Box
                sx={{
                    position: "absolute",
                    right: 16,
                    top: "45%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
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
                        mb: 1,
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
                    style={{
                        display: activeIndex >= songs.length - 1 ? "none" : "flex"
                    }}
                >
                    <ArrowDownward />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Discover;