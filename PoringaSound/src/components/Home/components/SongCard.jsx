import { Paper, Box, Typography } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const SongCard = ({ cancion, apiUrl }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                height: 300,
                width: 200,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 2,
            }}
        >
            {/* Imagen fija */}
            <Box
                sx={{
                    width: "100%",
                    height: 160, // Fijo
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
            </Box>

            {/* Contenido */}
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
