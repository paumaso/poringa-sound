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
    IconButton,
} from "@mui/material";
import { PhotoCamera, Audiotrack } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchGeneros } from "../../../../services/api";
import { fetchCreateSong } from "../../../../services/api";

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
            setTitle("");
            setAudioFile(null);
            setAudioPreview(null);
            setImageFile(null);
            setImagePreview(null);
            setGenero(null);
            setActive(false);
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Nueva Canción
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

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

                    <Autocomplete
                        options={generosList}
                        getOptionLabel={(option) => option.nombre || ""}
                        value={genero} 
                        onChange={(event, newValue) => setGenero(newValue)} 
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
                    <Box
                        sx={{
                            width: "100%",
                            height: "100px",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: "8px",
                            p: 2,
                            textAlign: "left",
                            flexGrow: 0,
                            mb: 2,
                        }}
                    >
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
                            <Box sx={{ mt: 1, position: "relative", display: "inline-block", width: "100%"}}>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    Archivo seleccionado: {audioFile.name}
                                </Typography>
                                <IconButton
                                    onClick={() => {
                                        setAudioFile(null);
                                        setAudioPreview(null);
                                    }}
                                    sx={{
                                        position: "absolute", 
                                        top: "50%", 
                                        right: 0, 
                                        transform: "translateY(-50%)", 
                                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            height: "170px",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: "8px",
                            p: 2,
                            textAlign: "center",
                            flexGrow: 0,
                        }}
                    >
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
                            <Box sx={{ mt: 1, position: "relative", display: "inline-block", }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        height: "auto",
                                        maxWidth: "100px",
                                        borderRadius: "10px",
                                        objectFit: "cover",
                                    }}
                                />
                                <IconButton
                                    onClick={() => {
                                        setImageFile(null);
                                        setImagePreview(null);
                                    }}
                                    sx={{
                                        position: "absolute",
                                        bottom: 0, // Botón al final
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
                <DialogActions sx={{ justifyContent: "center", p: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? "Subiendo..." : "Subir Cancion"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default NewSongDialog;