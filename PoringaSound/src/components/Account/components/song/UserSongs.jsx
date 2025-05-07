import React, { useEffect, useState } from "react";
import { fetchSongByUserId, fetchDeleteSong } from "../../../../services/songs";
import {
  CircularProgress,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import DeleteDialog from "../DeleteDialog";

const UserSongs = ({ userId, onSongClick }) => {
  const apiUrl = import.meta.env.VITE_STORAGE_URL;

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);


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

  const handleEdit = (song) => {
    console.log("Editar canción:", song);
  };

  const handleDeleteClick = (song) => {
    setSelectedSong(song);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedSong) {
        await fetchDeleteSong(selectedSong.id);
        setSongs((prevSongs) =>
          prevSongs.filter((song) => song.id !== selectedSong.id)
        );
        console.log("Canción eliminada:", selectedSong);
      }
    } catch (error) {
      console.error("Error al eliminar la canción:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSong(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedSong(null);
  };

  const handleShare = (song) => {
    console.log("Compartir canción:", song);
  };

  const handleSongClick = (song) => {
    setCurrentSong(song);
    setDrawerOpen(true);
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
      {songs.length === 0 ? (
        <Typography component="div" variant="body1" color="textSecondary">
          No hay canciones disponibles.
        </Typography>
      ) : (
        <List>
          {songs.map((song) => (
            <ListItem key={song.id} onClick={() => onSongClick(song)} sx={{ alignItems: "flex-start" }}>
              <ListItemAvatar>
                <Box
                  sx={{
                    position: "relative",
                    width: 64,
                    height: 64,
                    "&:hover .hover-overlay": {
                      opacity: 1,
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => handleSongClick(song)}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: "#f0f0f0",
                    }}
                    src={apiUrl + song.portada || undefined}
                    alt={song.titulo}
                  >
                    {!song.portada && (
                      <MusicNoteIcon sx={{ color: "#9e9e9e" }} />
                    )}
                  </Avatar>
                  <Box
                    className="hover-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      borderRadius: "8px",
                    }}
                  >
                    <PlayCircleIcon
                      sx={{ color: "white", fontSize: 40 }}
                    />
                  </Box>
                </Box>
              </ListItemAvatar>
              <Box sx={{ flex: 1, ml: 2 }}>
                <Typography variant="body1">{song.titulo}</Typography>
                <Chip label={song.genero.nombre} sx={{ mt: 1 }} />
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Tooltip title="Editar">
                  <IconButton
                    onClick={() => handleEdit(song)}
                    aria-label="Editar"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    onClick={() => handleDeleteClick(song)}
                    aria-label="Eliminar"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Compartir">
                  <IconButton
                    onClick={() => handleShare(song)}
                    aria-label="Compartir"
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {/* Modal de confirmación para eliminar */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        text={`¿Estás seguro de que deseas eliminar la canción "${selectedSong?.titulo}"? Esta acción no se puede deshacer.`}
      />
    </Box>
  );
};

export default UserSongs;