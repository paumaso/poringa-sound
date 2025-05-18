import { useEffect, useState, useRef } from "react";
import {
    IconButton,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { fetchAllSongs, fetchSongsPreferences } from "../../services/songs";
import { fetchAllAlbums } from "../../services/albums";
import { getToken, fetchUsersWithActiveSongs } from "../../services/auth";

import SongCard from "./components/SongCard";
import AlbumCard from "./components/AlbumCard";
import ArtistCard from "./components/ArtistCard";

// --- Estilos ---
const scrollContainerStyles = {
    display: "flex",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
    scrollPaddingX: 16,
    gap: 1,
    p: 1,
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
};

const iconButtonStyles = {
    left: {
        display: { xs: "none", sm: "flex" },
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
        "&:hover": { backgroundColor: "#e0e0e0" },
    },
    right: {
        display: { xs: "none", sm: "flex" },
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
        "&:hover": { backgroundColor: "#e0e0e0" },
    },
};

const spinnerContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: "100%",
};

const itemBoxStyles = {
    flex: "0 0 auto",
    scrollSnapAlign: "start",
    m: 1,
};

// --- Componente principal ---
const Home = ({ onSongClick, onDetailsClick }) => {
    // --- Estados ---
    const [canciones, setCanciones] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artistas, setArtistas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [albumsLoading, setAlbumsLoading] = useState(false);
    const [artistasLoading, setArtistasLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- Refs para scroll ---
    const scrollRefSongs = useRef(null);
    const scrollRefAlbums = useRef(null);
    const scrollRefArtists = useRef(null);

    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const scrollByAmount = 300;

    // --- Funciones de scroll ---
    const smoothScroll = (element, target, duration = 400) => {
        const start = element.scrollLeft;
        const change = target - start;
        const startTime = performance.now();

        const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const animateScroll = (currentTime) => {
            const time = Math.min(1, (currentTime - startTime) / duration);
            const eased = easeInOutQuad(time);
            element.scrollLeft = start + change * eased;
            if (time < 1) requestAnimationFrame(animateScroll);
        };

        requestAnimationFrame(animateScroll);
    };

    const scrollHandlers = (ref, direction) => {
        if (!ref.current) return;
        const offset = direction === "left" ? -scrollByAmount : scrollByAmount;
        const target = ref.current.scrollLeft + offset;
        smoothScroll(ref.current, target);

        // Paginación automática para canciones
        if (ref === scrollRefSongs && direction === "right" && page < totalPages) {
            const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;
            if (target >= maxScroll - 50) setPage(prev => prev + 1);
        }
    };

    // --- Fetchers ---
    const fetchCanciones = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const data = token ? await fetchSongsPreferences(page) : await fetchAllSongs(page);
            setCanciones(data?.canciones?.data ?? data?.data ?? []);
            setTotalPages(data?.last_page ?? 1);
        } catch (e) {
            console.error("Error fetching canciones:", e);
        }
        setLoading(false);
    };

    const fetchAlbumsData = async () => {
        setAlbumsLoading(true);
        try {
            const data = await fetchAllAlbums(1, 12);
            setAlbums(data?.data || []);
        } catch (e) {
            console.error("Error fetching albums:", e);
        }
        setAlbumsLoading(false);
    };

    const fetchArtistas = async () => {
        setArtistasLoading(true);
        try {
            const data = await fetchUsersWithActiveSongs({ page: 1, perPage: 12 });
            setArtistas(data?.data || []);
        } catch (e) {
            console.error("Error fetching artistas:", e);
        }
        setArtistasLoading(false);
    };

    // --- useEffect ---
    useEffect(() => {
        fetchCanciones();
        fetchAlbumsData();
        fetchArtistas();
    }, [page]);

    // --- Renderizado de secciones ---
    const renderSection = (title, items, loading, CardComponent, scrollRef, scrollLeft, scrollRight) => (
        <Box position="relative" width="100%" mb={4}>
            <Box m={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" px={2} mt={2} mb={1}>
                    <Typography variant="h6">{title}</Typography>
                    <Typography
                        variant="body2"
                        sx={{ cursor: "pointer", fontWeight: 400, '&:hover': { textDecoration: "underline" } }}
                        onClick={() => console.log(`Ver todos: ${title}`)}
                    >
                        Ver todos
                    </Typography>
                </Box>
                <IconButton onClick={scrollLeft} sx={iconButtonStyles.left}>
                    <ArrowBackIos />
                </IconButton>
                <Box ref={scrollRef} sx={scrollContainerStyles}>
                    {loading ? (
                        <Box sx={spinnerContainer}><CircularProgress /></Box>
                    ) : (
                        items.map((item) => (
                            <Box key={item.id} sx={itemBoxStyles}>
                                <CardComponent
                                    {...(title === 'Canciones'
                                        ? { cancion: item, onSongClick, onDetailsClick }
                                        : title === 'Álbumes'
                                        ? { album: item }
                                        : { artist: item })}
                                    apiUrl={apiUrl}
                                />
                            </Box>
                        ))
                    )}
                </Box>
                <IconButton onClick={scrollRight} sx={iconButtonStyles.right}>
                    <ArrowForwardIos />
                </IconButton>
            </Box>
        </Box>
    );

    // --- Render principal ---
    return (
        <Box width="100%">
            {renderSection("Canciones", canciones, loading, SongCard, scrollRefSongs,
                () => scrollHandlers(scrollRefSongs, "left"),
                () => scrollHandlers(scrollRefSongs, "right"))}

            {renderSection("Álbumes", albums, albumsLoading, AlbumCard, scrollRefAlbums,
                () => scrollHandlers(scrollRefAlbums, "left"),
                () => scrollHandlers(scrollRefAlbums, "right"))}

            {renderSection("Artistas", artistas, artistasLoading, ArtistCard, scrollRefArtists,
                () => scrollHandlers(scrollRefArtists, "left"),
                () => scrollHandlers(scrollRefArtists, "right"))}
        </Box>
    );
};

export default Home;