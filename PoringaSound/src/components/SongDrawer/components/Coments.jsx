import React, { useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Paper,
    TextField,
    IconButton,
    Divider,
    Card,
    CardContent,
    CardHeader
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { comentarCancion } from "../../../services/interactions";

const Coments = ({ coments = [], cancionId, onNewComent }) => {
    const [newComent, setNewComent] = useState("");

    const handleSend = async () => {
        if (newComent.trim() === "") return;

        try {
            const comentarioData = await comentarCancion(cancionId, newComent.trim());

            if (onNewComent) onNewComent(comentarioData);
            setNewComent("");
        } catch (error) {
            console.error("Error al agregar el comentario:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Card sx={{ width: "100%", mt: 3, boxShadow: 2 }}>
            <CardHeader title="Comentarios" />
            <CardContent>
                <Box
                    sx={{
                        maxHeight: 200,
                        overflowY: "auto",
                        pr: 1,
                        mb: 2,
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": {
                            width: "6px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#ccc",
                            borderRadius: "3px",
                        },
                    }}
                >
                    {coments.length > 0 ? (
                        coments.map((coment, idx) => (
                            <Box key={idx} sx={{ display: "flex", mb: 1 }}>
                                <Avatar sx={{ mr: 1, bgcolor: "#1976d2", width: 32, height: 32 }}>
                                    {coment.user?.nombre?.charAt(0).toUpperCase() || "?"}
                                </Avatar>
                                <Paper
                                    sx={{
                                        flex: 1,
                                        p: 1,
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                        gutterBottom
                                    >
                                        {coment.user?.nombre || "Anónimo"}
                                    </Typography>
                                    <Typography variant="body2">
                                        {coment.comentario}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ mt: 5 }}
                        >
                            No hay comentarios todavía.
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Escribe un comentario..."
                        variant="outlined"
                        size="small"
                        value={newComent}
                        onChange={(e) => setNewComent(e.target.value)}
                        sx={{ mr: 1 }}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSend}
                        sx={{
                            bgcolor: "#1976d2",
                            color: "#fff",
                            "&:hover": { bgcolor: "#1565c0" },
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Coments;