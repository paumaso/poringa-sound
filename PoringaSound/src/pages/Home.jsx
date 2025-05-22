import { useEffect, useState, useRef } from "react";
import {
    IconButton,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { fetchAllSongs } from "../services/songs";
import { fetchAllAlbums } from "../services/albums";
import { getToken, fetchUsersWithActiveSongs } from "../services/auth";
import { useNavigate } from "react-router-dom";

import SongCard from "../components/Cards/SongCard";
import AlbumCard from "../components/Cards/AlbumCard";
import ArtistCard from "../components/Cards/ArtistCard";

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
        left: 5,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        boxShadow: 1,
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: "#ffffffee",
        "&:hover": { backgroundColor: "#f1f1f1" },
    },
    right: {
        display: { xs: "none", sm: "flex" },
        position: "absolute",
        right: 5,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        boxShadow: 1,
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: "#ffffffee",
        "&:hover": { backgroundColor: "#f1f1f1" },
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
    width: { xs: 140, sm: 160, md: 180 },
};

// --- Componente principal ---
const Home = ({ onSongClick, onDetailsClick }) => {
    const [canciones, setCanciones] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artistas, setArtistas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [albumsLoading, setAlbumsLoading] = useState(false);
    const [artistasLoading, setArtistasLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const scrollRefSongs = useRef(null);
    const scrollRefAlbums = useRef(null);
    const scrollRefArtists = useRef(null);

    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const navigate = useNavigate();
    const scrollByAmount = 300;

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

        if (ref === scrollRefSongs && direction === "right" && page < totalPages) {
            const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;
            if (target >= maxScroll - 50) setPage(prev => prev + 1);
        }
    };

    const fetchCanciones = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const data = await fetchAllSongs({ page, perPage: 12, orden: "interacciones", direccion: "desc" });
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
            const data = await fetchAllAlbums({ page: 1, perPage: 12 });
            setAlbums(data?.albums?.data || data?.data || []);
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

    useEffect(() => {
        fetchCanciones();
        fetchAlbumsData();
        fetchArtistas();
    }, [page]);

    const renderSection = (title, items, loading, CardComponent, scrollRef, scrollLeft, scrollRight) => (
        <Box position="relative" width="100%" mb={4} px={{ xs: 1, sm: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={1} mt={3} mb={2}>
                <Typography variant="h5" fontWeight={500}>
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        cursor: "pointer",
                        fontWeight: 500,
                        color: "primary.main",
                        '&:hover': { textDecoration: "underline" },
                    }}
                    onClick={() => {
                        if (title === "Canciones") navigate("/songs");
                        else if (title === "Álbumes") navigate("/albums");
                        else if (title === "Artistas") navigate("/artists");
                    }}
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
    );

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
