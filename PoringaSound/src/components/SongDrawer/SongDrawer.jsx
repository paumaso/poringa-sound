import React from "react";
import { Box, IconButton, Button, Drawer, useTheme, useMediaQuery } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AudioPlayer from "./components/AudioPlayer";

const SongDrawer = ({ open, onDrawerToggle, songId, album }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleDrawer = (newOpen) => () => {
        if (onDrawerToggle) {
            onDrawerToggle(newOpen);
        }
    };

    return (
        <div>
            {!open && (
                <Button
                    onClick={toggleDrawer(true)}
                    variant="contained"
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        minWidth: 0,
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        zIndex: 1000,
                    }}
                >
                    <MusicNoteIcon />
                </Button>
            )}

            <Drawer
                anchor="right"
                open={open}
                variant="persistent"
                sx={{
                    "& .MuiDrawer-paper": {
                        width: isMobile ? "100vw" : 400,
                        height: isMobile ? "100vh" : "calc(100% - 74px)",
                        top: "74px",
                        position: "fixed",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxSizing: "border-box",
                    },
                }}
            >
                <Box sx={{ flex: 1, overflowY: "auto", position: "relative", px: 2, py: 1 }}>
                    <IconButton
                        onClick={toggleDrawer(false)}
                        sx={{
                            position: "sticky",
                            top: 0,
                            left: 0,
                            zIndex: 100,
                        }}
                        aria-label="Cerrar"
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Box sx={{ mt: 3 }}>
                        {album
                            ? <AudioPlayer filters={{ album_id: album }} albumMode={true} />
                            : <AudioPlayer initialSongId={songId} />
                        }
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
};

export default SongDrawer;
