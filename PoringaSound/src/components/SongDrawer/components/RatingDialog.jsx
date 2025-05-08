import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Rating,
    DialogActions,
    Button,
} from "@mui/material";

const RatingDialog = ({ open, onClose, onSubmit, value, setValue }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Puntúa esta canción</DialogTitle>
            <DialogContent>
                <Rating
                    name="song-rating"
                    value={value}
                    onChange={(event, newValue) => setValue(newValue)}
                    size="large"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={() => onSubmit(value)} variant="contained">
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RatingDialog;
