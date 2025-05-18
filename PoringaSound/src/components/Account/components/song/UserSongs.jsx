import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Portada from "../../../LazyImages/Portada";
import "../UserSongsAnimations.css";
import { fetchSongByUserId, fetchDeleteSong, fetchGeneros } from "../../../../services/songs";
import {
  CircularProgress,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  MenuItem
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import EditSongDialog from "./EditSongDialog";
import DeleteDialog from "../DeleteDialog";

const UserSongs = ({ userId, onSongClick, reloadSongs, onSongsUpdated }) => {
  const apiUrl = import.meta.env.VITE_STORAGE_URL;
  const navigate = useNavigate(); // ✅

  const nodeRefs = useRef({});
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [generos, setGeneros] = useState([]);
  const [generoId, setGeneroId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGeneros().then(setGeneros);
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await fetchSongByUserId(userId, page, perPage, generoId, search);
        setSongs(data.data);
        setTotalPages(data.last_page || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        if (onSongsUpdated) onSongsUpdated();
      }
    };

    fetchSongs();
  }, [reloadSongs, userId, page, perPage, generoId, search, onSongsUpdated]);

  const handleEdit = (song) => {
    setSelectedSong(song);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedSong(null);
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

  const handleDetailsClick = (song) => {
    navigate(`/song/${song.id}`); // ✅ Ir a detalles
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
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <TextField
          label="Buscar"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          size="small"
        />
        <TextField
          select
          label="Género"
          value={generoId}
          onChange={e => { setGeneroId(e.target.value); setPage(1); }}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {generos.map(g => (
            <MenuItem key={g.id} value={g.id}>{g.nombre}</MenuItem>
          ))}
        </TextField>
      </Box>
      {songs.length === 0 ? (
        <Typography component="div" variant="body1" color="textSecondary">
          No hay canciones disponibles.
        </Typography>
      ) : (
        <List
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            minHeight: "200px",
            scrollbarWidth: "none",
          }}
          className="hide-scrollbar"
        >
          <TransitionGroup>
            {songs.map((song) => {
              if (!nodeRefs.current[song.id]) {
                nodeRefs.current[song.id] = React.createRef();
              }
              const ref = nodeRefs.current[song.id];
              return (
                <CSSTransition
                  key={song.id}
                  timeout={200}
                  classNames="song-fade"
                  nodeRef={ref}
                >
                  <ListItem ref={ref} key={song.id} sx={{ alignItems: "flex-start" }}>
                    <ListItemAvatar onClick={() => onSongClick(song)}>
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
                      >
                        <Portada
                          src={song.portada ? apiUrl + song.portada : null}
                          alt={song.titulo}
                          icon={<MusicNoteIcon sx={{ color: "#9e9e9e" }} />}
                          width="100%"
                          height="100%"
                          sx={{
                            borderRadius: 2,
                            objectFit: "cover",
                            bgcolor: "#f0f0f0"
                          }}
                        />
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
                          <PlayCircleIcon sx={{ color: "white", fontSize: 40 }} />
                        </Box>
                      </Box>
                    </ListItemAvatar>
                    <Box sx={{ flex: 1, ml: 2 }}>
                      <Typography variant="body1">{song.titulo}</Typography>
                      <Chip label={song.genero.nombre} sx={{ mt: 1 }} />
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(song)} aria-label="Editar">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleDeleteClick(song)} aria-label="Eliminar">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Detalles">
                        <IconButton onClick={() => handleDetailsClick(song)} aria-label="Detalles">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </List>
      )}

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

      {selectedSong && (
        <EditSongDialog
          open={editDialogOpen}
          onClose={handleEditClose}
          onSave={(updatedSong) => {
            setSongs((prevSongs) =>
              prevSongs.map((song) =>
                song.id === updatedSong.id ? { ...song, ...updatedSong } : song
              )
            );
            setEditDialogOpen(false);
            setSelectedSong(null);
          }}
          song={selectedSong}
        />
      )}

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
