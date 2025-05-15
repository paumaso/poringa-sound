import { useEffect, useState, useRef } from "react";
import {
    IconButton,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import SongCard from "./components/SongCard";
import { fetchAllSongs, fetchSongsPreferences } from "../../services/songs";
import { getToken } from "../../services/auth";

const Home = ({ onSongClick, onDetailsClick }) => {
    const [canciones, setCanciones] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const scrollContainerRef = useRef(null);

    const fetchCanciones = async () => {
        setLoading(true);
        try {
            let data;
            const token = getToken();

            if (token) {
                data = await fetchSongsPreferences(page);
            } else {
                data = await fetchAllSongs(page);
            }

            setCanciones(data?.canciones?.data ?? data?.data ?? []);
            console.log("Canciones:", data);
            setTotalPages(data?.last_page ?? 1);
        } catch (error) {
            console.error("Error fetching canciones:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCanciones();
    }, [page]);

    const scrollByAmount = 300;

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            const target = scrollContainerRef.current.scrollLeft - scrollByAmount;
            smoothScroll(scrollContainerRef.current, target);
        }
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const target = container.scrollLeft + scrollByAmount;
            smoothScroll(container, target);

            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            if (target >= maxScrollLeft - 50 && page < totalPages) {
                setPage((prev) => prev + 1);
            }
        }
    };

    const smoothScroll = (element, target, duration = 400) => {
        const start = element.scrollLeft;
        const change = target - start;
        const startTime = performance.now();

        const easeInOutQuad = (t) =>
            t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const animateScroll = (currentTime) => {
            const time = Math.min(1, (currentTime - startTime) / duration);
            const eased = easeInOutQuad(time);

            element.scrollLeft = start + change * eased;

            if (time < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    return (
        <Box width="100%">
            <Box position="relative" width="100%" mb={4}>
                <Box m={2}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        px={2}
                        mt={2}
                        mb={1}
                    >
                        <Typography variant="h6">
                            Canciones
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                cursor: "pointer",
                                fontWeight: 400,
                                "&:hover": { textDecoration: "underline" },
                            }}
                            onClick={() => {
                                console.log("Ver todas clicado");
                            }}
                        >
                            Ver todas
                        </Typography>
                    </Box>
                    {/* Flecha Izquierda */}
                    <IconButton
                        onClick={handleScrollLeft}
                        sx={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                            boxShadow: 2,
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: "#f0f0f0",
                            "&:hover": {
                                backgroundColor: "#e0e0e0",
                            },
                        }}
                    >
                        <ArrowBackIos />
                    </IconButton>

                    {/* Carrusel */}
                    <Box
                        ref={scrollContainerRef}
                        sx={{
                            display: "flex",
                            overflowX: "auto",
                            scrollBehavior: "smooth",
                            p: 1,
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": { display: "none" },
                        }}
                    >
                        {loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 250,
                                    width: "100%",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : (
                            canciones.map((cancion, index) => (
                                <Box
                                    key={`${cancion.id}-${index}`} 
                                    sx={{ flex: "0 0 auto", m: 1 }}
                                >
                                    <SongCard
                                        cancion={cancion}
                                        apiUrl={apiUrl}
                                        onSongClick={onSongClick}
                                        onDetailsClick={onDetailsClick}
                                    />
                                </Box>
                            ))
                        )}
                    </Box>

                    {/* Flecha Derecha */}
                    <IconButton
                        onClick={handleScrollRight}
                        disabled={page >= totalPages && canciones.length === 0}
                        sx={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                            boxShadow: 2,
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: "white",
                            "&:hover": {
                                backgroundColor: "#e0e0e0",
                            },
                        }}
                    >
                        <ArrowForwardIos />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;