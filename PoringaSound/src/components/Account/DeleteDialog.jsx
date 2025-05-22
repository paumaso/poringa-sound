import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
} from "@mui/material";

const DeleteDialog = ({ open, onClose, onConfirm, text }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Error al confirmar:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? null : onClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="delete-dialog-description">{text}</DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <Button onClick={onClose} color="primary" variant="outlined" disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    color="error"
                    variant="contained"
                    autoFocus
                    disabled={loading}
                >
                    {loading ? "Confirmando..." : "Confirmar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
