import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

const DeleteDialog = ({ open, onClose, onConfirm, text }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "center",
                    gap: 2, 
                }}
            >
                <Button onClick={onClose} color="primary" variant="outlined">
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    autoFocus
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;