import { Paper, Box, Typography, Stack, Avatar } from "@mui/material";
import Portada from "../../LazyImages/Portada";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AlbumCard = ({ album, apiUrl }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (album?.id) {
            navigate(`/album/${album.id}`);
        }
    };

    return (
        <Paper
            elevation={2}
            onClick={handleClick}
            sx={{
                width: { xs: 120, sm: 140, md: 160 },
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 4,
                },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    position: "relative",
                }}
            >
                <Portada
                    src={`${apiUrl}${album.portada}`}
                    alt={album.titulo}
                    width="100%"
                    height="100%"
                    hover={false}
                    style={{ objectFit: "cover" }}
                />
            </Box>

            <Box sx={{ px: 1.2, py: 1 }}>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mb: 0.5,
                    }}
                >
                    {album.titulo}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                        src={album.user?.imagen_perfil ? `${apiUrl}${album.user.imagen_perfil}` : undefined}
                        alt={album.user?.nombre}
                        sx={{ width: 26, height: 26 }}
                    />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: "0.75rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                        }}
                    >
                        {album.user?.nombre || "Autor desconocido"}
                    </Typography>

                    <InfoOutlinedIcon
                        sx={{ fontSize: 18, color: "text.secondary", flexShrink: 0 }}
                        titleAccess="Ver detalles del álbum"
                    />
                </Stack>
            </Box>
        </Paper>
    );
};

export default AlbumCard;
