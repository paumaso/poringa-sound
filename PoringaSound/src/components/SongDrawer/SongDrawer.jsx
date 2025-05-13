import React from "react";
import { Box, IconButton, Button, Drawer, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AudioPlayer from "./components/AudioPlayer";

const SongDrawer = ({ open, onDrawerToggle, songData }) => {
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
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        minWidth: "0",
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 999,
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
                        width: "400px",
                        top: "74px",
                        height: "calc(100% - 74px)",
                        display: "flex",
                        flexDirection: "column",
                        position: "fixed",
                    },
                }}
            >

                <Box sx={{ flex: 1, overflowY: "auto", position: "relative", px: 1, }}>
                    <IconButton
                        onClick={toggleDrawer(false)}
                        sx={{
                            position: "sticky",
                            top: "0px",
                            left: 0,
                            zIndex: 100,
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>

                    <AudioPlayer songId={songData} />
                </Box>
            </Drawer>
        </div>
    );
};

export default SongDrawer;
