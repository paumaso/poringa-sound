import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    IconButton,
    Autocomplete,
    Chip,
    CircularProgress
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchSongByUserId } from "../../../../services/songs";
import { fetchUpdateAlbum } from "../../../../services/albums";

const EditAlbumDialog = ({ open, onClose, onSave, album, userId }) => {
    const [title, setTitle] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [allSongs, setAllSongs] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchSongs, setSearchSongs] = useState("");
    const [loadingSongs, setLoadingSongs] = useState(false);

    useEffect(() => {
        if (!open) return;
        const loadSongs = async () => {
            setLoadingSongs(true);
            try {
                const data = await fetchSongByUserId(userId, 1, 50, "", searchSongs);
                const uniqueSongs = data.data.map(song => ({
                    ...song,
                    uniqueKey: `${song.id}_${song.titulo}`
                }));
                setAllSongs(uniqueSongs);
            } catch (err) {
                console.error("Error cargando canciones:", err);
                setError("Error al cargar las canciones");
            } finally {
                setLoadingSongs(false);
            }
        };

        loadSongs();
    }, [open, userId, searchSongs]);

    useEffect(() => {
        if (album && open) {
            setTitle(album.titulo || "");
            setCoverPreview(album.portadaUrl || null);
            setSelectedSongs(album.canciones?.map(song => ({
                ...song,
                uniqueKey: `${song.id}_${song.titulo}`
            })) || []);
            setCoverFile(null);
            setError(null);
        }
    }, [album, open]);

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
            setError(null);
        } else {
            setError("Por favor, sube un archivo de imagen válido");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return setError("El título es requerido");
        if (selectedSongs.length === 0) return setError("Selecciona al menos una canción");

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("titulo", title.trim());
            if (coverFile) formData.append("portada", coverFile);

            selectedSongs.forEach((song, index) => {
                formData.append(`canciones[${index}]`, song.id);
            });

            await fetchUpdateAlbum(album.id, formData);

            const updatedAlbum = {
                ...album,
                titulo: title.trim(),
                canciones: selectedSongs,
                portada: coverFile ? URL.createObjectURL(coverFile) : album.portada,
            };

            onSave(updatedAlbum);
            handleClose();
        } catch (error) {
            setError(error.message || "Error al actualizar álbum");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitle("");
        setCoverFile(null);
        setCoverPreview(null);
        setSelectedSongs([]);
        setSearchSongs("");
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Editar Álbum
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <TextField
                        label="Título"
                        fullWidth
                        margin="dense"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        error={!title.trim() && error}
                    />

                    <Autocomplete
                        multiple
                        options={allSongs}
                        getOptionLabel={(option) => option.titulo}
                        filterSelectedOptions
                        value={selectedSongs}
                        onChange={(event, newValue) => setSelectedSongs(newValue)}
                        onInputChange={(event, newInputValue) => {
                            setSearchSongs(newInputValue);
                        }}
                        loading={loadingSongs}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionKey={(option) => option.uniqueKey}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    label={option.titulo}
                                    {...getTagProps({ index })}
                                    key={option.uniqueKey}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                margin="normal"
                                label="Buscar y seleccionar canciones"
                                placeholder="Escribe para buscar..."
                                error={selectedSongs.length === 0 && error}
                                helperText={selectedSongs.length === 0 && error ? "Selecciona al menos una canción" : ""}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingSongs ? (
                                                <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        sx={{ mt: 2 }}
                    />

                    <Box
                        sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            p: 2,
                            textAlign: "center",
                            mt: 2,
                        }}
                    >
                        <input
                            accept="image/*"
                            id="edit-image-upload-button"
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleCoverChange}
                        />
                        <label htmlFor="edit-image-upload-button">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                startIcon={<PhotoCamera />}
                            >
                                Cambiar imagen
                            </Button>
                        </label>

                        {coverPreview && (
                            <Box sx={{ mt: 1, position: "relative", display: "inline-block" }}>
                                <img
                                    src={coverPreview}
                                    alt="Preview"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                                <IconButton
                                    onClick={() => {
                                        setCoverFile(null);
                                        setCoverPreview(null);
                                    }}
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ height: '48px' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar Cambios"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default EditAlbumDialog;
