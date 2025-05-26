import {
    Paper,
    Box,
    Typography,
    Avatar,
    Stack,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Portada from "../LazyImages/Portada";

const SongCard = ({ cancion, apiUrl, onSongClick }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const avatarSrc = cancion?.user?.imagen_perfil
        ? `${apiUrl}${cancion.user.imagen_perfil}`
        : null;

    const artistInitial = cancion?.user?.nombre
        ? cancion.user.nombre.charAt(0).toUpperCase()
        : "?";

    return (
        <Paper
            elevation={3}
            sx={{
                width: { xs: 120, sm: 140, md: 160 },
                height: "auto",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": {
                    transform: "scale(1.02)",
                },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    position: "relative",
                    cursor: "pointer",
                }}
                onClick={() => onSongClick(cancion)}
            >
                <Portada
                    src={`${apiUrl}${cancion.portada}`}
                    alt={cancion.titulo}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                />
            </Box>

            <Box sx={{ px: 1, py: 0.75, flexGrow: 1 }}>
                <Typography
                    onClick={() => navigate(`/song/${cancion.id}`)}
                    variant="subtitle1"
                    sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        lineHeight: 1.2,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        "&:hover": { color: "primary.main", textDecoration: "underline" }
                    }}
                >
                    {cancion?.titulo || "Título desconocido"}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Avatar
                        src={avatarSrc}
                        alt={cancion.user?.nombre}
                        sx={{
                            width: 26,
                            height: 26,
                            bgcolor: theme.palette.primary.main,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "transform 0.18s cubic-bezier(.4,2,.6,1)",
                            "&:hover": {
                                transform: "scale(1.18)",
                                boxShadow: 2,
                            },
                        }}
                        onClick={() => navigate(`/artist/${cancion.user?.id}`)}
                    >
                        {artistInitial}
                    </Avatar>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            minWidth: 0,
                            flexGrow: 1,
                        }}
                        onClick={() => navigate(`/artist/${cancion.user?.id}`)}

                    >
                        {cancion?.user?.nombre || "Artista desconocido"}
                    </Typography>
                </Stack>
            </Box>
        </Paper>
    );
};

export default SongCard;
