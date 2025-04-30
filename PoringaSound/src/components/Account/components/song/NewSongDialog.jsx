import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Grid,
    Box,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Autocomplete,
} from "@mui/material";
import { PhotoCamera, Audiotrack } from "@mui/icons-material";
import { fetchGeneros } from "../../../../services/api";

const NewSongDialog = ({ open, onClose, onSave }) => {
    const [title, setTitle] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [albumId, setAlbumId] = useState("");
    const [genero, setGenero] = useState("");
    const [generosList, setGenerosList] = useState([]);
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGeneros = async () => {
            try {
                const data = await fetchGeneros();
                setGenerosList(data);
            } catch (error) {
                console.error("Error al cargar géneros:", error);
            }
        };

        loadGeneros();
    }, []);

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioFile(file);
            setAudioPreview(URL.createObjectURL(file));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!title || !audioFile) {
            setError("Título y archivo de audio son requeridos");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("titulo", title);
            formData.append("album_id", albumId);
            formData.append("duracion", duracion);
            formData.append("genero", genero);
            formData.append("active", active ? 1 : 0);
            formData.append("archivo", audioFile);
            if (imageFile) {
                formData.append("portada", imageFile);
            }

            await onSave(formData); // onSave debe enviar el FormData al backend

            // Limpiar campos
            setTitle("");
            setAudioFile(null);
            setAudioPreview(null);
            setImageFile(null);
            setImagePreview(null);
            setAlbumId("");
            setDuracion("");
            setGenero("");
            setActive(false);

            onClose();
        } catch (error) {
            setError(error.message || "Error al guardar la canción");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>Agregar nueva canción</DialogTitle>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                            {error}
                        </Typography>
                    )}

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Título"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />

                    {/* <TextField
                        margin="dense"
                        label="ID del Álbum"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={albumId}
                        onChange={(e) => setAlbumId(e.target.value)}
                        sx={{ mb: 2 }}
                    /> */}

                    <Autocomplete
                        options={generosList}
                        getOptionLabel={(option) => option.nombre || ""}
                        value={genero}
                        onChange={(event, newValue) => setGenero(newValue?.nombre || "")}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Género"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                required
                            />
                        )}
                        disablePortal
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                        }
                        label="Quieres que la canción esté publica?"
                        sx={{ mb: 2 }}
                    />

                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <input
                                accept="audio/*"
                                style={{ display: "none" }}
                                id="audio-upload-button"
                                type="file"
                                onChange={handleAudioChange}
                                required
                            />
                            <label htmlFor="audio-upload-button">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                    startIcon={<Audiotrack />}
                                >
                                    Subir audio
                                </Button>
                            </label>
                            {audioPreview && (
                                <Typography variant="caption" display="block">
                                    Archivo seleccionado: {audioFile.name}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={6}>
                            <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="image-upload-button"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="image-upload-button">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                    startIcon={<PhotoCamera />}
                                >
                                    Subir imagen
                                </Button>
                            </label>
                            {imagePreview && (
                                <Box sx={{ mt: 1, textAlign: "center" }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ maxWidth: "100%", maxHeight: 100 }}
                                    />
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary" disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default NewSongDialog;
