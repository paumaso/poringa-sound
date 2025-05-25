import { Paper, Box, Typography, Stack, Avatar, Chip } from "@mui/material";
import AlbumIcon from "@mui/icons-material/Album";
import Portada from "../LazyImages/Portada";
import { useNavigate } from "react-router-dom";

const AlbumCard = ({ album, apiUrl, onAlbumClick }) => {
    const navigate = useNavigate();
    const artist = album.user;
    const avatarSrc = artist?.imagen_perfil ? `${apiUrl}${artist.imagen_perfil}` : null;
    const artistInitial = artist?.nombre?.charAt(0).toUpperCase() || "?";

    return (
        <Paper
            elevation={4}
            sx={{
                width: { xs: 120, sm: 140, md: 160 },
                height: "auto",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#f0f4ff",
                position: "relative",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": {
                    transform: "scale(1.04)",
                    boxShadow: 4,
                },
            }}
        >
            <Chip
                icon={<AlbumIcon sx={{ color: "primary.main" }} />}
                label="Álbum"
                size="small"
                sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: "white",
                    color: "primary.main",
                    fontWeight: 700,
                    zIndex: 2,
                }}
            />

            {/* Portada */}
            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    position: "relative",
                    cursor: "pointer",
                }}
                onClick={() => onAlbumClick && onAlbumClick(album.id)}
            >
                <Portada
                    src={`${apiUrl}${album.portada}`}
                    alt={album.titulo}
                    width="100%"
                    height="100%"
                    hover={true}
                    style={{
                        objectFit: "cover",
                        borderRadius: 0,
                    }}
                />
            </Box>

            <Box sx={{ px: 1, py: 0.75, flexGrow: 1 }}>
                <Typography
                    onClick={() => navigate(`/album/${album.id}`)}
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
                    {album?.titulo || "Álbum sin título"}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Avatar
                        src={avatarSrc}
                        alt={artist?.nombre}
                        sx={{
                            width: 26,
                            height: 26,
                            bgcolor: "primary.main",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "transform 0.18s cubic-bezier(.4,2,.6,1)",
                            "&:hover": {
                                transform: "scale(1.18)",
                                boxShadow: 2,
                            },
                        }}
                        onClick={() => navigate(`/artist/${artist?.id}`)}
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
                        onClick={() => navigate(`/artist/${artist?.id}`)}
                    >
                        {artist?.nombre || "Artista desconocido"}
                    </Typography>
                </Stack>
            </Box>
        </Paper>
    );
};

export default AlbumCard;