import { useEffect, useState, useMemo } from "react";
import {
    Grid,
    IconButton,
    CircularProgress,
    Typography,
    Box,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import SongCard from "./components/SongCard";

const Home = () => {
    const [canciones, setCanciones] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const theme = useTheme();

    // Detectar tamaño de pantalla para definir perPage dinámicamente
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));

    const perPage = useMemo(() => {
        if (isXs) return 2;
        if (isSm) return 4;
        if (isMd) return 6;
        if (isLg) return 8;
        return 6;
    }, [isXs, isSm, isMd, isLg]);

    const fetchCanciones = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/canciones/random-list?page=${page}&per_page=${perPage}`);
            setCanciones(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Error fetching canciones:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Siempre resetear a la página 1 si cambia el tamaño de pantalla
        setPage(1);
    }, [perPage]);

    useEffect(() => {
        fetchCanciones();
    }, [page, perPage]);

    const handlePrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    return (
        <Box width="100%">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={5}
                mt={2}
                mb={2}
            >
                <Typography variant="h6" sx={{ ml: 8 }}>
                    Canciones
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        cursor: "pointer",
                        mr: 8,
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

            <Box display="flex" justifyContent="space-around" mb={2}>
                <IconButton onClick={handlePrevPage} disabled={page === 1}>
                    <ArrowBackIos />
                </IconButton>

                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2} px={5}>
                        {canciones.map((cancion, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={cancion.id || `song-${index}`}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                }}
                            >
                                <SongCard cancion={cancion} apiUrl={apiUrl} />
                            </Grid>
                        ))}
                    </Grid>
                )}

                <IconButton onClick={handleNextPage} disabled={page >= totalPages}>
                    <ArrowForwardIos />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Home;