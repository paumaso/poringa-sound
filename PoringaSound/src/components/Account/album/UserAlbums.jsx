import React, { useEffect, useState, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import "../UserSongsAnimations.css";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
    IconButton,
    TextField,
    Tooltip,
    Collapse,
    Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import Search from "../../Filters/Serch";
import PaginationBar from "../../Filters/PaginationBar";
import DeleteDialog from "../DeleteDialog";
import Portada from "../../LazyImages/Portada";
import { fetchAlbumsByUserId, fetchDeleteAlbum } from "../../../services/albums";
import EditAlbumDialog from "./EditAlbumDialog";

import Toolbar from "../../Filters/Toolbar";


const UserAlbums = ({ userId, reloadAlbums, onAlbumsUpdated, onAlbumClick }) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const navigate = useNavigate();
    const nodeRefs = useRef({});

    const [loading, setLoading] = useState();
    const [albums, setAlbums] = useState([]);
    const [expandedAlbumId, setExpandedAlbumId] = useState(null);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [direccion, setDireccion] = useState("asc");

    const [albumToDelete, setAlbumToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [albumToEdit, setAlbumToEdit] = useState(null);

    const fetchAlbums = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAlbumsByUserId(userId, page, perPage, search);
            setAlbums(data.data);
            setTotalPages(data.last_page || 1);
            if (onAlbumsUpdated) onAlbumsUpdated();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, [userId, page, perPage, search, reloadAlbums]);

    const openDeleteDialog = (album) => {
        setAlbumToDelete(album);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setAlbumToDelete(null);
    };

    const confirmDeleteAlbum = async () => {
        if (!albumToDelete) return;

        try {
            await fetchDeleteAlbum(albumToDelete.id);
            setAlbums((prev) => prev.filter((a) => a.id !== albumToDelete.id));
            if (onAlbumsUpdated) onAlbumsUpdated();
        } catch (error) {
            console.error("Error al eliminar álbum:", error);
        } finally {
            closeDeleteDialog();
        }
    };

    const handleEdit = (album) => {
        setAlbumToEdit(album);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setAlbumToEdit(null);
    };

    const handleEditSave = (updatedAlbum) => {
        setAlbums((prev) =>
            prev.map((a) => (a.id === updatedAlbum.id ? { ...a, ...updatedAlbum } : a))
        );
        setEditDialogOpen(false);
        setAlbumToEdit(null);
    };

    const handleDelete = (album) => {
        openDeleteDialog(album);
    };

    const handleView = (album) => {
    navigate(`/album/${album.id}`);
    };

    const handleSongView = (song) => {
        navigate(`/song/${song.id}`);
    };

    const toggleExpand = (albumId) => {
        setExpandedAlbumId(expandedAlbumId === albumId ? null : albumId);
    };

    const handleResetFilters = () => {
        setSearch("");
        setDireccion("asc");
        setPage(1);
    };

    if (error) {
        return <Box p={3}><Typography color="error">{error}</Typography></Box>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box display="flex" gap={2} mb={2} alignItems="center">
                <Toolbar
                    page={page}
                    totalPages={totalPages}
                    onPrevPage={() => setPage(page - 1)}
                    onNextPage={() => setPage(page + 1)}
                    showSearch={true}
                    showDireccion={true}
                    searchValue={search}
                    onSearchChange={e => { setSearch(e.target.value); setPage(1); }}
                    direccionValue={direccion}
                    onDireccionChange={e => { setDireccion(e.target.value); setPage(1); }}
                    onResetFilters={handleResetFilters}
                />
            </Box>

            {albums.length === 0 ? (
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
                        {albums.map((album) => {
                            if (!nodeRefs.current[album.id]) {
                                nodeRefs.current[album.id] = React.createRef();
                            }
                            const ref = nodeRefs.current[album.id];
                            const isExpanded = expandedAlbumId === album.id;

                            return (
                                <CSSTransition
                                    key={album.id}
                                    timeout={200}
                                    classNames="song-fade"
                                    nodeRef={ref}
                                >
                                    <div ref={ref}>
                                        <ListItem
                                            key={album.id}
                                            sx={{
                                                alignItems: "flex-start",
                                                flexDirection: "column",
                                                borderBottom: "1px solid #eee"
                                            }}
                                        >
                                            <Box display="flex" width="100%">
                                                <ListItemAvatar>
                                                    <Box sx={{ width: 64, height: 64 }}>
                                                        <Portada
                                                            src={album.portada ? `${apiUrl}${album.portada}` : undefined}
                                                            alt={album.titulo}
                                                            width="100%"
                                                            height="100%"
                                                            onClick={() => onAlbumClick && onAlbumClick(album.id)}
                                                        />
                                                    </Box>
                                                </ListItemAvatar>
                                                <Box sx={{ flex: 1, ml: 2 }}>
                                                    <Typography variant="h6">{album.titulo}</Typography>
                                                </Box>
                                                <Box display="flex" gap={1} alignItems="center">
                                                    <Tooltip title={isExpanded ? "Ocultar canciones" : "Mostrar canciones"}>
                                                        <IconButton onClick={() => toggleExpand(album.id)}>
                                                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Editar">
                                                        <IconButton onClick={() => handleEdit(album)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton onClick={() => handleDelete(album)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Detalles">
                                                        <IconButton onClick={() => handleView(album)}>
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>

                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit sx={{ width: "100%", mt: 1 }}>
                                                {album.canciones?.length > 0 ? (
                                                    <List dense disablePadding>
                                                        {album.canciones.map((cancion) => (
                                                            <React.Fragment key={cancion.id}>
                                                                <ListItem sx={{ pl: 7, alignItems: "center" }}>
                                                                    <Box sx={{ width: 48, height: 48, mr: 2 }}>
                                                                        <Portada
                                                                            src={cancion.portada ? `${apiUrl}${cancion.portada}` : undefined}
                                                                            alt={cancion.titulo}
                                                                            width="100%"
                                                                            height="100%"
                                                                            hover={true}
                                                                            onClick={() => handleSongView(cancion)}
                                                                        />
                                                                    </Box>
                                                                    <ListItemText
                                                                        primary={cancion.titulo}
                                                                        secondary={cancion.genero_id || "Sin género"}
                                                                        sx={{ flex: 1 }}
                                                                    />
                                                                    <Tooltip title="Detalles de la canción">
                                                                        <IconButton onClick={() => handleSongView(cancion)}>
                                                                            <VisibilityIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </ListItem>
                                                                <Divider variant="inset" component="li" />
                                                            </React.Fragment>
                                                        ))}
                                                    </List>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" ml={7}>
                                                        Este álbum no tiene canciones.
                                                    </Typography>
                                                )}
                                            </Collapse>
                                        </ListItem>
                                    </div>
                                </CSSTransition>
                            );
                        })}
                    </TransitionGroup>
                </List>
            )}

            <DeleteDialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDeleteAlbum}
                text={`¿Estás seguro que deseas eliminar el álbum "${albumToDelete?.titulo}"? Esta acción no se puede deshacer.`}
            />

            {/* Diálogo de edición */}
            <EditAlbumDialog
                open={editDialogOpen}
                onClose={handleEditClose}
                onSave={handleEditSave}
                album={albumToEdit}
                userId={userId}
            />
        </Box>
    );
};

export default UserAlbums;
