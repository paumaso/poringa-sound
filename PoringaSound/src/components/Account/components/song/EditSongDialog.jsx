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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchGeneros } from "../../../../services/api";

const EditSongDialog = ({ open, onClose, onSave, song }) => {
    const [title, setTitle] = useState("");
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

    useEffect(() => {
        if (song) {
            setTitle(song.titulo || "");
            setGenero(song.genero || "");
            setActive(song.active || false);
        }
    }, [song]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("titulo", title);
            formData.append("genero_id", genero?.id || "");
            formData.append("active", active ? "1" : "0");

            await fetchUpdateSong(song.id, formData);

            onSave();
            onClose();
        } catch (error) {
            console.error("Error al guardar la canción:", error);
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
                    <Typography variant="h6">Editar Canción</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

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

                    <Autocomplete
                        options={generosList}
                        getOptionLabel={(option) => option.nombre || ""}
                        value={genero}
                        onChange={(event, newValue) => setGenero(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Género"
                                margin="dense"
                                fullWidth
                                required
                            />
                        )}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                        }
                        label="Quieres que la canción esté publica?"
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default EditSongDialog;