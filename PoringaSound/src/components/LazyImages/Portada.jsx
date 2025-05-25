import { useState } from "react";
import { Box } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const isValidSrc = (src) => {
    if (!src || typeof src !== "string") return false;
    const s = src.trim().toLowerCase();
    return (
        s !== "" &&
        s !== "null" &&
        s !== "undefined" &&
        !s.endsWith("/null") &&
        !s.endsWith("/undefined")
    );
};

const Portada = ({
    src,
    alt,
    width = "100%",
    height = "auto",
    effect = "blur",
    onClick,
    style = {},
    hover = true,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasImage = isValidSrc(src);

     return (
        <Box
            sx={{
                width,
                height,
                position: "relative",
                overflow: "hidden",
                cursor: onClick ? "pointer" : "default",
                backgroundColor: !hasImage ? "#e0e0e0" : undefined,
                borderRadius: 2,
                ...style,
            }}
            onMouseEnter={hover ? () => setIsHovered(true) : undefined}
            onMouseLeave={hover ? () => setIsHovered(false) : undefined}
            onClick={onClick}
        >
            {hasImage ? (
                <LazyLoadImage
                    src={src}
                    alt={alt}
                    width="100%"
                    height="100%"
                    effect={effect}
                    style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        display: "block",
                    }}
                />
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MusicNoteIcon sx={{ color: "#9e9e9e", fontSize: 48 }} />
                </Box>
            )}
            {hover && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: isHovered ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transition: "opacity 0.3s, background-color 0.3s",
                        opacity: isHovered ? 1 : 0,
                    }}
                >
                    <PlayCircleIcon sx={{ color: "white", fontSize: 48, cursor: "pointer" }} />
                </Box>
            )}
        </Box>
    );
};

export default Portada;