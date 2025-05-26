import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Box,
    Grid,
    Alert,
    Divider,
    CircularProgress,
} from "@mui/material";
import { editUser } from "../../services/auth";
import { PhotoCamera, Close as CloseIcon } from "@mui/icons-material";

const EditAccountDialog = ({ open, onClose, user, onSave }) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const [nombre, setNombre] = useState(user?.nombre || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.imagen_perfil ? user.imagen_perfil : null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNombre(user?.nombre || "");
        setEmail(user?.email || "");
        setPassword("");
        setImage(null);
        setImagePreview(user?.imagen_perfil ? user.imagen_perfil : null);
        setError(null);
    }, [user, open]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('email', email);
            if (password) formData.append('password', password);
            if (image) formData.append('imagen_perfil', image);

            const updatedUser = await editUser(user.id, formData);
            onSave?.(updatedUser);
            onClose?.();
        } catch (error) {
            setError(error.message || 'Error al actualizar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
                <DialogTitle sx={{ p: 2, pb: 1 }}>Edit Account</DialogTitle>
                <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={9}>
                            <TextField
                                label="Name"
                                fullWidth
                                margin="normal"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="edit-upload-button"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="edit-upload-button">
                                <IconButton component="span">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview.startsWith("blob:") ? imagePreview : apiUrl + imagePreview}
                                            alt="Preview"
                                            style={{ width: 50, height: 50, borderRadius: "50%" }}
                                        />
                                    ) : (
                                        <PhotoCamera />
                                    )}
                                </IconButton>
                            </label>
                        </Grid>
                    </Grid>

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={18} />}
                    >
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditAccountDialog;