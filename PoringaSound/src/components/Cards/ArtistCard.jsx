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
                cursor: "default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 100,
                textAlign: "center",
                p: 1,
                borderRadius: 2,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 3,
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
                    fontSize: "1.75rem",
                    fontWeight: 600,
                    color: imageUrl ? "inherit" : "#fff",
                    backgroundColor: imageUrl ? "transparent" : theme.palette.primary.main,
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
                    variant="caption"
                    noWrap
                    sx={{
                        mt: 1,
                        maxWidth: "100%",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        color: "text.primary",
                    }}
                >
                    {artist.nombre}
                </Typography>
            </Tooltip>
        </Box>
    );
};

export default ArtistCard;
