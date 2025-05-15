import React, { useState } from "react";
import { IconButton, Typography, Box, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getToken } from "../../services/auth";
import { likeSong, quitarLike } from "../../services/interactions";

const LikeButton = ({ songId, initialLiked, initialLikeCount }) => {
    const isAuthenticated = !!getToken();
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
    const [pulse, setPulse] = useState(false);

    const toggleLike = async () => {
        if (!isAuthenticated) return;

        try {
            if (liked) {
                await quitarLike(songId);
                setLiked(false);
                setLikeCount((prev) => prev - 1);
            } else {
                await likeSong(songId);
                setLiked(true);
                setLikeCount((prev) => prev + 1);
                setPulse(true);
                setTimeout(() => setPulse(false), 300); 
            }
        } catch (error) {
            console.error("Error al interactuar con like:", error);
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <Tooltip title={isAuthenticated ? "Dar like" : "Inicia sesión para dar like"}>
                <span>
                    <IconButton
                        onClick={toggleLike}
                        disabled={!isAuthenticated}
                        sx={{
                            p: 0,
                            transform: pulse ? "scale(1.3)" : "scale(1)",
                            transition: "transform 0.2s ease-in-out",
                        }}
                    >
                        {liked ? (
                            <FavoriteIcon sx={{ color: "error.main", transition: "color 0.3s ease" }} />
                        ) : (
                            <FavoriteBorderIcon sx={{ transition: "color 0.3s ease" }} />
                        )}
                    </IconButton>
                </span>
            </Tooltip>
            <Typography variant="subtitle2">
                {likeCount}
            </Typography>
        </Box>
    );
};

export default LikeButton;
