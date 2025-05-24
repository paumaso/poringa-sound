import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Portada from "../../LazyImages/Portada";
import "../UserSongsAnimations.css";
import { fetchSongByUserId, fetchDeleteSong } from "../../../services/songs";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import EditSongDialog from "./EditSongDialog";
import DeleteDialog from "../DeleteDialog";

// Importa tus filtros personalizados
import Search from "../../Filters/Serch";
import GeneroSelect from "../../Filters/GenerosSelect";
import OrdenSelect from "../../Filters/OrdenSelect";
import DireccionSelect from "../../Filters/DireccionSelect";
import PaginationBar from "../../Filters/PaginationBar";

import Toolbar from "../../Filters/Toolbar";

const UserSongs = ({ userId, onSongClick, reloadSongs, onSongsUpdated }) => {
  const apiUrl = import.meta.env.VITE_STORAGE_URL;
  const navigate = useNavigate();

  const nodeRefs = useRef({});
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [generoId, setGeneroId] = useState("");
  const [search, setSearch] = useState("");
  const [orden, setOrden] = useState("nombre");
  const [direccion, setDireccion] = useState("asc");

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const data = await fetchSongByUserId(
          userId,
          page,
          perPage,
          { generoId, query: search, orden, direccion }
        );
        setSongs(data.data);
        setTotalPages(data.last_page || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [userId, page, perPage, generoId, search, orden, direccion, reloadSongs]);
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
    navigate(`/song/${song.id}`);
  };

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error al cargar las canciones: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1, position: "relative" }}>
      <Box display="flex" gap={2} mb={2} alignItems="center" flexWrap="wrap">
        <Toolbar
          page={page}
          totalPages={totalPages}
          onPrevPage={() => setPage(page - 1)}
          onNextPage={() => setPage(page + 1)}
          showSearch={true}
          showGenero={true}
          showOrden={true}
          showDireccion={true}
          searchValue={search}
          onSearchChange={e => { setSearch(e.target.value); setPage(1); }}
          generoValue={generoId}
          onGeneroChange={e => { setGeneroId(e.target.value); setPage(1); }}
          ordenValue={orden}
          onOrdenChange={e => { setOrden(e.target.value); setPage(1); }}
          direccionValue={direccion}
          onDireccionChange={e => { setDireccion(e.target.value); setPage(1); }}
        />
      </Box>

      {songs.length === 0 ? (
        loading ? (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Typography>No hay canciones disponibles.</Typography>
          </Box>
        )
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

      {selectedSong && (
        <EditSongDialog
          open={editDialogOpen}
          onClose={handleEditClose}
          onSave={(updatedSong) => {
            let generoObj = updatedSong.genero;
            if (!generoObj && updatedSong.genero_id) {
              const generoList = songs.find(s => s.id === selectedSong.id)?.genero
                ? [songs.find(s => s.id === selectedSong.id).genero]
                : [];
              generoObj = generoList.find(g => g.id === updatedSong.genero_id) || { nombre: "Desconocido" };
            }
            setSongs((prevSongs) =>
              prevSongs.map((song) =>
                song.id === updatedSong.id
                  ? { ...song, ...updatedSong, genero: generoObj }
                  : song
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