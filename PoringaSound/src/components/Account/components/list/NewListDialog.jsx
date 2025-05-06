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
import CloseIcon from "@mui/icons-material/Close";

const NewListDialog = ({ open, onClose, onSave }) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("nombre", name);

            await onSave(formData);

            setName("");

            onClose();
        } catch (error) {
            console.error("Error al crear la lista:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>
                    <Typography variant="h6">Nueva Lista de Reproducción</Typography>
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
                        label="Nombre"
                        fullWidth
                        margin="dense"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {loading ? "Creando..." : "Crear Lista"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default NewListDialog;