import React, { useEffect, useState } from "react";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import AudioPlayer from "../components/SongDrawer/components/AudioPlayer";
import SongCard from "../components/Discover/SongCard";
import { fetchDiscoverSongs } from "../services/songs";

const Discover = () => {
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const perPage = 1;

    useEffect(() => {
        const loadSong = async () => {
            setLoading(true);
            try {
                const res = await fetchDiscoverSongs(page, perPage);
                const nuevas = res.canciones?.data || [];
                setSongs(nuevas);
                setHasMore(res.canciones?.next_page_url !== null);
            } catch (err) {
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };
        loadSong();
    }, [page]);

    const handleNext = () => {
        if (hasMore) setPage(page + 1);
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <Box sx={{ position: "relative", bgcolor: "#111", minHeight: "calc(100vh - 74px)", overflow: "hidden", }}>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 74px)" }}>
                    <CircularProgress sx={{ color: "#fff" }} />
                </Box>
            ) : songs.length > 0 ? (
                <SongCard
                    song={songs[0]}
                    isActive={true}
                />
            ) : (
                <Typography color="white" align="center" mt={4}>
                    No hay canciones para descubrir.
                </Typography>
            )}

            <Box
                sx={{
                    position: "absolute",
                    right: 16,
                    top: "45%",
                    display: "flex",
                    flexDirection: "column",
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
                        mb: 1,
                    }}
                    disabled={page === 1}
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
                    disabled={!hasMore}
                >
                    <ArrowDownward />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Discover;