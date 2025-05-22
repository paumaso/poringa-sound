import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Autocomplete,
    IconButton,
    Alert
} from "@mui/material";
import { PhotoCamera, Audiotrack, Close as CloseIcon } from "@mui/icons-material";
import { fetchGeneros, fetchCreateSong } from "../../../services/songs";

const NewSongDialog = ({ open, onClose, onSave }) => {
    const [title, setTitle] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [genero, setGenero] = useState("");
    const [generosList, setGenerosList] = useState([]);
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open) resetForm();
    }, [open]);

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

        try {
            const formData = new FormData();
            formData.append("titulo", title);
            formData.append("genero_id", genero?.id || "");
            formData.append("active", active ? "1" : "0");

            if (audioFile) formData.append("archivo", audioFile);
            if (imageFile) formData.append("portada", imageFile);

            await fetchCreateSong(formData);

            resetForm();
            onSave?.();
            onClose?.();
        } catch (error) {
            console.error("Error al crear la canción:", error);
            setError(error.message || "Error al crear la canción");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setAudioFile(null);
        setAudioPreview(null);
        setImageFile(null);
        setImagePreview(null);
        setGenero("");
        setActive(false);
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
                    <Typography variant="h6">Nueva Canción</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <DialogContent dividers>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Título y Género */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 2,
                            mb: 2,
                        }}
                    >
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
                                <Box
                                    sx={{
                                        mt: 1,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography variant="caption" noWrap>
                                        {audioFile.name}
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

                    {/* Checkbox */}
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
                        {loading ? <CircularProgress size={24} /> : "Subir Canción"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default NewSongDialog;
