import { Paper, Box, Typography, IconButton } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useState } from "react";

const SongCard = ({ cancion, apiUrl, onSongClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <Paper
            elevation={3}
            sx={{
                height: 250,
                width: 200,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 2,
                cursor: "pointer",
                position: "relative",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Box
                onClick={() => onSongClick(cancion)}
                sx={{
                    width: "100%",
                    height: 160,
                    position: "relative",
                    backgroundColor: "#eee",
                }}
            >
                {cancion?.portada ? (
                    <img
                        src={`${apiUrl}${cancion.portada}`}
                        alt={cancion.titulo}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MusicNoteIcon sx={{ color: "#9e9e9e" }} />
                    </Box>
                )}

                {isHovered && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            opacity: 1,
                            transition: "opacity 0.3s ease",
                        }}
                    >
                        <PlayCircleIcon
                            sx={{ color: "white", fontSize: 40 }}
                        />
                    </Box>
                )}
            </Box>

            <Box sx={{ padding: 2, flexGrow: 1, overflow: "hidden" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "1rem",
                        wordBreak: "break-word",
                        lineHeight: 1.3,
                        mb: 1,
                        maxHeight: "2.6em",
                        overflow: "hidden",
                    }}
                >
                    {cancion?.titulo || "Título desconocido"}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: "0.875rem",
                        wordBreak: "break-word",
                        lineHeight: 1.2,
                        maxHeight: "2.4em",
                        overflow: "hidden",
                    }}
                >
                    {cancion?.user?.nombre || "Artista desconocido"}
                </Typography>
            </Box>
        </Paper>
    );
};

export default SongCard;
