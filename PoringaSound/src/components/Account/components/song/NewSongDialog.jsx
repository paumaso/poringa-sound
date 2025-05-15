import React, { useState, useEffect } from "react";
import {
    Dialog,
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
    IconButton,
} from "@mui/material";
import { PhotoCamera, Audiotrack, Close as CloseIcon } from "@mui/icons-material";
import { fetchGeneros, fetchCreateSong } from "../../../../services/api";

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
        try {
            const formData = new FormData();
            formData.append("titulo", title);
            formData.append("genero_id", genero?.id || "");
            formData.append("active", active ? "1" : "0");
            formData.append("archivo", audioFile);
            if (imageFile) {
                formData.append("portada", imageFile);
            }

            const response = await fetchCreateSong(formData);
            if (response.status !== 200) {
                resetForm();
            }

            onSave();
            onClose();
        } catch (error) {
            console.error("Error al crear la canción:", error);
            setError(error.message);
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
            <Box component="form" onSubmit={handleSubmit}>
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
                        Nueva Canción
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <DialogContent dividers>
                    {error && (
                        <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                            {error}
                        </Typography>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                label="Título"
                                width="100%"
                                fullWidth
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                width="100%"

                                options={generosList}
                                getOptionLabel={(option) => option.nombre || ""}
                                value={genero}
                                onChange={(e, newValue) => setGenero(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Género" variant="outlined" required />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={active}
                                        onChange={(e) => setActive(e.target.checked)}
                                    />
                                }
                                label="¿Quieres que la canción esté pública?"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    p: 2,
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
                                            sx={{ backgroundColor: "rgba(255,255,255,0.7)" }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    p: 2,
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
                        </Grid>
                    </Grid>
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
