import {
    Paper,
    Box,
    Typography,
    Avatar,
    Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../services/auth";
import Portada from "../../LazyImages/Portada";

const SongCard = ({ cancion, apiUrl, onSongClick, onDetailsClick }) => {
    const isAuthenticated = !!getToken();
    const navigate = useNavigate();

    const handleTitleClick = () => {
        if (onDetailsClick && cancion?.id) {
            navigate(`/song/${cancion.id}`);
        }
    };

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
                cursor: "default",
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

            <Box sx={{ px: 1.5, py: 1, flexGrow: 1 }}>
                <Typography
                    variant="subtitle1"
                    onClick={handleTitleClick}
                    sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        lineHeight: 1.2,
                        cursor: "pointer",
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    {cancion?.titulo || "Título desconocido"}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Avatar
                        src={cancion.user.imagen_perfil ? `${apiUrl}${cancion.user.imagen_perfil}` : undefined}
                        alt={cancion.user.nombre}
                        sx={{ width: 26, height: 26, flexShrink: 0 }}
                    />
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
                    >
                        {cancion?.user?.nombre || "Artista desconocido"}
                    </Typography>
                </Stack>
            </Box>
        </Paper>
    );
};

export default SongCard;
