import React, { useEffect, useState } from "react";
import {
    Box, Typography, List, ListItem, ListItemAvatar,
    Avatar, CircularProgress, IconButton, TextField
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AlbumIcon from "@mui/icons-material/Album";
import { fetchAlbumsByUserId } from "../../../../services/albums";

const UserAlbums = ({ userId }) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;

    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [perPage] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchAlbums = async () => {
            setLoading(true);
            try {
                const data = await fetchAlbumsByUserId(userId, page, perPage, search);
                setAlbums(data.data);
                setTotalPages(data.last_page || 1);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbums();
    }, [userId, page, perPage, search]);

    if (loading) {
        return <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box p={3}><Typography color="error">{error}</Typography></Box>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box display="flex" gap={2} mb={2} alignItems="center">
                <TextField
                    label="Buscar álbum"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    size="small"
                />
            </Box>

            {albums.length === 0 ? (
                <Typography>No hay álbumes disponibles.</Typography>
            ) : (
                <List>
                    {albums.map((album) => (
                        <ListItem key={album.id}>
                            <ListItemAvatar>
                                <Avatar
                                    variant="rounded"
                                    src={album.portada ? `${apiUrl}${album.portada}` : undefined}
                                    sx={{ width: 64, height: 64, bgcolor: "#f5f5f5" }}
                                >
                                    {!album.portada && <AlbumIcon />}
                                </Avatar>
                            </ListItemAvatar>
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="body1">{album.titulo}</Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}

            <Box
                sx={{
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: "white",
                    py: 2,
                    mt: 4,
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        backgroundColor: "#fff",
                        borderTop: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 1,
                        zIndex: 999,
                    }}
                >
                    <IconButton
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        size="large"
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>
                        Página {page} de {totalPages}
                    </Typography>
                    <IconButton
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        size="large"
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default UserAlbums;
