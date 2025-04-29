import React, { useEffect, useState } from "react";
import { fetchSongByUserId } from "../../../../services/api";
import {
    CircularProgress,
    Box,
    Chip,
    Fab,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Menu,
    MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const UserSongs = ({ userId }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const data = await fetchSongByUserId(userId);
                setSongs(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [userId]);

    const handleMenuOpen = (event, song) => {
        setAnchorEl(event.currentTarget);
        setSelectedSong(song);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSong(null);
    };

    const handleAddSong = () => {
        console.log("Agregar canción");
    };

    const handleMenuItemClick = (action) => {
        console.log(`${action} canción:`, selectedSong);
        handleMenuClose();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">Error al cargar las canciones: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 1, position: "relative" }}>
            {/* Lista de canciones */}
            {songs.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No hay canciones disponibles.
                </Typography>
            ) : (
                <List>
                    {songs.map((song) => (
                        <ListItem
                            key={song.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="options"
                                    onClick={(e) => handleMenuOpen(e, song)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        >
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64, 
                                    borderRadius: 1,
                                    overflow: "hidden", 
                                    marginRight: 2,
                                    backgroundColor: "#f0f0f0",
                                }}
                            >
                                {song.portada ? (
                                    <img
                                        src={song.portada}
                                        alt={song.titulo}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover", 
                                        }}
                                    />
                                ) : (
                                    <MusicNoteIcon
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            color: "#9e9e9e",
                                        }}
                                    />
                                )}
                            </Box>
                            <ListItemText
                                primary={song.titulo}
                                secondary={
                                    <>
                                        <Chip label={song.genero} variant="outlined" />
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Menú de opciones */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('Editar')}>Editar</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Eliminar')}>Eliminar</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Compartir')}>Compartir</MenuItem>
            </Menu>
        </Box>
    );
};

export default UserSongs;