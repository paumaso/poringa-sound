import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";
import AudioPlayer from "../SongDrawer/components/AudioPlayer";
import { fetchSongsPreferences } from "../../services/songs";

const DiscoverPage = () => {
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
            const nuevasCanciones = res.canciones.data;
            setSongs((prev) => [...prev, ...nuevasCanciones]);
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

    return (
        <Box
            ref={containerRef}
            onScroll={handleScroll}
            sx={{
                height: "80vh",
                overflowY: "scroll",
                scrollSnapType: "y mandatory",
            }}
        >
            {songs.map((song, index) => (
                <Box
                    key={song.id}
                    sx={{
                        height: "100vh",
                        scrollSnapAlign: "start",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 2,
                    }}
                >
                    <AudioPlayer songId={song.id} />
                </Box>
            ))}

            {loading && (
                <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </Box>
            )}

            {!hasMore && !loading && songs.length === 0 && (
                <Typography color="white" align="center" sx={{ mt: 4 }}>
                    No hay canciones disponibles.
                </Typography>
            )}
        </Box>
    );
};

export default DiscoverPage;
