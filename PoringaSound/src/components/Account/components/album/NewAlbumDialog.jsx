import React, { useState } from "react";
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
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const NewAlbumDialog = ({ open, onClose, onSave }) => {
    const [title, setTitle] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("titulo", title);
            formData.append("fecha_lanzamiento", releaseDate);
            if (coverFile) {
                formData.append("portada", coverFile);
            }

            await onSave(formData);

            setTitle("");
            setReleaseDate("");
            setCoverFile(null);
            setCoverPreview(null);

            onClose();
        } catch (error) {
            console.error("Error al crear el álbum:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>
                    <Typography variant="h6">Nuevo Álbum</Typography>
                    <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
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
                    />
                    <TextField
                        label="Fecha de Lanzamiento"
                        type="date"
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        required
                    />
                    <Box sx={{ mt: 2 }}>
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="cover-upload-button"
                            type="file"
                            onChange={handleCoverChange}
                        />
                        <label htmlFor="cover-upload-button">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                startIcon={<PhotoCamera />}
                            >
                                Subir Portada
                            </Button>
                        </label>
                        {coverPreview && (
                            <Box sx={{ mt: 2, textAlign: "center" }}>
                                <img
                                    src={coverPreview}
                                    alt="Portada"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {loading ? "Creando..." : "Crear Álbum"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default NewAlbumDialog;