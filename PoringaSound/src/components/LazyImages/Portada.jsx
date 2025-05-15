import { useState } from "react";
import { Box } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

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

    const hasImage = !!src;
    const showHover = hover && isHovered;

    return (
        <Box
            sx={{
                width,
                height,
                position: "relative",
                overflow: "hidden",
                cursor: hover && onClick ? "pointer" : "default",
                backgroundColor: !hasImage ? "#eee" : undefined,
                pointerEvents: hover ? "auto" : "none",
                ...style,
            }}
            onMouseEnter={hover ? () => setIsHovered(true) : undefined}
            onMouseLeave={hover ? () => setIsHovered(false) : undefined}
            onClick={hover ? onClick : undefined}
        >
            {hasImage ? (
                <>
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
                    {showHover && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                transition: "opacity 0.3s ease",
                                opacity: 1,
                            }}
                        >
                            <PlayCircleIcon sx={{ color: "white", fontSize: 48 }} />
                        </Box>
                    )}
                </>
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
        </Box>
    );
};

export default Portada;