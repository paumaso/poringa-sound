import { Paper, Box, Typography, Tooltip } from "@mui/material";
import { getToken } from "../../../services/auth";
import Portada from "../../LazyImages/Portada";

const SongCard = ({ cancion, apiUrl, onSongClick, onDetailsClick }) => {
    const isAuthenticated = !!getToken();

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
                position: "relative",
                cursor: "default",
            }}
        >
            <Portada
                src={`${apiUrl}${cancion.portada}`}
                alt={cancion.titulo}
                width="100%"
                height="100%"
                onClick={() => onSongClick(cancion)}
            />

            <Box sx={{ padding: 2, flexGrow: 1, overflow: "hidden" }}>
                <Typography
                    variant="h6"
                    onClick={() => onDetailsClick?.(cancion?.id)}
                    sx={{
                        fontSize: "1rem",
                        wordBreak: "break-word",
                        lineHeight: 1.3,
                        mb: 1,
                        maxHeight: "2.6em",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <Tooltip title={cancion?.titulo || "Título desconocido"}>
                        <Box component="span">
                            {cancion?.titulo || "Título desconocido"}
                        </Box>
                    </Tooltip>
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
