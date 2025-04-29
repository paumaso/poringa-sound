import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";

const NewSongDialog = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Agregar nuevo elemento</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Título"
                    type="text"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    margin="dense"
                    label="Descripción"
                    type="text"
                    fullWidth
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={onClose} color="primary">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewSongDialog;