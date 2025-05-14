import React, { useState } from "react";
import { Box, Rating, Tooltip } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { getToken } from "../../services/auth";
import { puntuarCancion } from "../../services/interactions";

const RatingSong = ({ songId, initialRating = 0 }) => {
    const isAuthenticated = getToken() !== null;
    const [rating, setRating] = useState(initialRating);
    const [pulse, setPulse] = useState(false);

    const handleRatingChange = async (_, newValue) => {
        if (!isAuthenticated || newValue === null) return;

        try {
            await puntuarCancion(songId, newValue);
            setRating(newValue);
            setPulse(true); 
            setTimeout(() => setPulse(false), 300); 
        } catch (error) {
            console.error("Error al puntuar la canción:", error);
        }
    };

    return (
        <Box>
            <Tooltip title={isAuthenticated ? "Puntuar canción" : "Inicia sesión para puntuar"}>
                <span>
                    <Rating
                        name="song-rating"
                        value={rating}
                        onChange={handleRatingChange}
                        disabled={!isAuthenticated}
                        icon={
                            <StarIcon
                                fontSize="inherit"
                                sx={{
                                    transition: "transform 0.2s ease, color 0.3s ease",
                                    ...(pulse && {
                                        transform: "scale(1.2)",
                                        color: "gold", 
                                    }),
                                }}
                            />
                        }
                        emptyIcon={
                            <StarBorderIcon
                                fontSize="inherit"
                                sx={{
                                    transition: "transform 0.2s ease, color 0.3s ease",
                                }}
                            />
                        }
                        precision={1}
                        size="large"
                        sx={{
                            "& .MuiRating-iconFilled": {
                                color: "gold",
                            },
                            "& .MuiRating-iconEmpty": {
                                color: "#BDBDBD",
                            },
                            "& .MuiRating-iconHover": {
                                transform: "scale(1.2)", 
                            },
                        }}
                    />
                </span>
            </Tooltip>
        </Box>
    );
};

export default RatingSong;
