import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    Autocomplete,
    IconButton,
    Box,
    CircularProgress,
    Alert
} from "@mui/material";
import { PhotoCamera, Audiotrack, Close as CloseIcon } from "@mui/icons-material";
import { fetchGeneros, fetchUpdateSong } from "../../../services/songs";

const EditSongDialog = ({ open, onClose, onSave, song }) => {
    const [title, setTitle] = useState("");
    const [genero, setGenero] = useState(null);
    const [generosList, setGenerosList] = useState([]);
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

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

    useEffect(() => {
        if (song) {
            setTitle(song.titulo || "");
            setGenero(song.genero || null);
            setActive(!!song.active);

            setAudioFile(null);
            setAudioPreview(song.audioUrl || null);
            setImageFile(null);
            setImagePreview(song.portadaUrl || null);
            setError(null);
        } else {
            resetForm();
        }
    }, [song]);

    const resetForm = () => {
        setTitle("");
        setGenero(null);
        setActive(false);
        setAudioFile(null);
        setAudioPreview(null);
        setImageFile(null);
        setImagePreview(null);
        setError(null);
    };

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

        try {
            const formData = new FormData();
            formData.append("titulo", title);
            formData.append("genero_id", genero?.id || "");
            formData.append("active", active ? "1" : "0");
            if (audioFile) formData.append("archivo", audioFile);
            if (imageFile) formData.append("portada", imageFile);

            const response = await fetchUpdateSong(song.id, formData);

            onSave(response);
            onClose();
        } catch (error) {
            console.error("Error al guardar la canción:", error);
            setError(error?.message || "Error inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="h6" component="div">
                        Editar Canción
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <DialogContent dividers>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
                        <TextField
                            label="Título"
                            fullWidth
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <Autocomplete
                            options={generosList}
                            getOptionLabel={(option) => option.nombre || ""}
                            value={genero}
                            onChange={(e, newValue) => setGenero(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Género" variant="outlined" />
                            )}
                            fullWidth
                        />
                    </Box>

                    {/* Audio e Imagen */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 5,
                            mb: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Audio */}
                        <Box
                            sx={{
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 2,
                                width: 400,
                                minWidth: 400,
                                maxWidth: 400,
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                            }}
                        >
                            <input
                                accept="audio/*"
                                id="audio-upload-button"
                                type="file"
                                style={{ display: "none" }}
                                onChange={handleAudioChange}
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
                                <Box
                                    sx={{
                                        mt: 1,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography variant="caption" noWrap>
                                        {audioFile ? audioFile.name : "Audio actual"}
                                    </Typography>
                                    <IconButton
                                        onClick={() => {
                                            setAudioFile(null);
                                            setAudioPreview(null);
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>

                        {/* Imagen */}
                        <Box
                            sx={{
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 2,
                                width: 400,
                                minWidth: 400,
                                maxWidth: 400,
                                textAlign: "center",
                            }}
                        >
                            <input
                                accept="image/*"
                                id="image-upload-button"
                                type="file"
                                style={{ display: "none" }}
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
                                <Box sx={{ mt: 1, position: "relative", display: "inline-block" }}>
                                    <img
                                        src={imagePreview}
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
                                            setImageFile(null);
                                            setImagePreview(null);
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
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                        }
                        label="¿Quieres que la canción esté pública?"
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Guardar Cambios"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default EditSongDialog;
