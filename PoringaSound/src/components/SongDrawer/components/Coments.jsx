import React, { useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Paper,
    TextField,
    IconButton,
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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
                maxWidth: 500,
                mx: "auto",
                p: 2,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: "#fff",
            }}
        >
            <Box
                sx={{
                    height: 250,
                    overflowY: "scroll",
                    p: 1,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    backgroundColor: "#f5f5f5",
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#aaa",
                        borderRadius: "3px",
                    },
                }}
            >
                {coments.length > 0 ? (
                    coments.map((coment, idx) => (
                        <Box key={idx} sx={{ display: "flex", mb: 1 }}>
                            <Avatar sx={{ mr: 1, bgcolor: "#1976d2", width: 32, height: 32 }}>
                                {coment.user?.imagen_perfil ? (
                                    <img
                                        src={coment.user.imagen_perfil}
                                        alt={coment.user?.nombre}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    coment.user?.nombre?.charAt(0).toUpperCase() || "?"
                                )}
                            </Avatar>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1,
                                    bgcolor: "#e3f2fd",
                                    borderRadius: 2,
                                    flex: 1,
                                }}
                            >
                                <Typography variant="body2">{coment.comentario}</Typography>
                            </Paper>
                        </Box>
                    ))
                ) : (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", mt: 10 }}
                    >
                        No hay comentarios.
                    </Typography>
                )}
            </Box>

            {/* Input para enviar comentario */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TextField
                    fullWidth
                    placeholder="Escribe un comentario..."
                    variant="outlined"
                    size="small"
                    value={newComent}
                    onChange={(e) => setNewComent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{ mr: 1 }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    sx={{ bgcolor: "#1976d2", color: "#fff", "&:hover": { bgcolor: "#1565c0" } }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Coments;
