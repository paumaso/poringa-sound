import React from "react";
import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ArtistCard = ({ artist, apiUrl }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const imageUrl = artist.imagen_perfil ? `${apiUrl}${artist.imagen_perfil}` : null;
    const artistInitial = artist?.nombre?.charAt(0).toUpperCase() || "?";

    return (
        <Box
            onClick={() => navigate(`/artist/${artist.id}`)}
            sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 120,
                minHeight: 160,
                textAlign: "center",
                p: 2,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
                transition: "transform 0.25s, box-shadow 0.25s, background 0.25s",
                "&:hover": {
                    transform: "scale(1.07)",
                    boxShadow: 6,
                    background: "linear-gradient(135deg, #e3f0ff 0%, #b6e0fe 100%)",
                },
            }}
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: imageUrl ? "inherit" : "#fff",
                    backgroundColor: imageUrl ? "transparent" : theme.palette.primary.main,
                    boxShadow: 2,
                    mb: 1,
                    transition: "box-shadow 0.25s, border-color 0.25s",
                    "&:hover": {
                        transform: "scale(1.07)",
                        boxShadow: 4,
                    },
                }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={artist.nombre}
                        loading="lazy"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                            display: "block",
                        }}
                    />
                ) : (
                    artistInitial
                )}
            </Box>

            <Tooltip title={artist.nombre} arrow>
                <Typography
                    variant="subtitle1"
                    noWrap
                    sx={{
                        mt: 1,
                        maxWidth: "100%",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "text.primary",
                        letterSpacing: 0.2,
                        textShadow: "0 1px 2px rgba(0,0,0,0.06)",
                    }}
                >
                    {artist.nombre}
                </Typography>
            </Tooltip>
        </Box>
    );
};

export default ArtistCard;