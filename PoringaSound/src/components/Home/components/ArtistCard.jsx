import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import 'react-lazy-load-image-component/src/effects/blur.css';

const ArtistCard = ({ artist, apiUrl }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (artist?.id) {
            navigate(`/artist/${artist.id}`);
        }
    };
    const imageUrl = artist.imagen_perfil ? `${apiUrl}${artist.imagen_perfil}` : undefined;

    return (
        <Box
            onClick={handleClick}
            sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 100,
                gap: 1,
                textAlign: "center"
            }}
        >
            <Box
                sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: 2,
                    transition: "transform 0.3s ease",
                    bgcolor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                        transform: "scale(1.1)"
                    }
                }}
            >
                <LazyLoadImage
                    src={imageUrl}
                    alt={artist.nombre}
                    effect="blur"
                    width="100%"
                    height="100%"
                    style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        display: "block"
                    }}
                />
            </Box>
            <Tooltip title={artist.nombre} arrow>
                <Typography
                    variant="body2"
                    noWrap
                    sx={{
                        maxWidth: 90,
                        fontWeight: 500
                    }}
                >
                    {artist.nombre}
                </Typography>
            </Tooltip>
        </Box>
    );
};

export default ArtistCard;