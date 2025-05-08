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
            {/* Botón flotante para abrir el Drawer */}
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
                        zIndex: 1300,
                    }}
                >
                    <MusicNoteIcon />
                </Button>
            )}

            {/* Drawer lateral */}
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
                {/* Contenedor principal scrollable */}
                <Box sx={{ flex: 1, overflowY: "auto", position: "relative", px: 2, pt: 1 }}>
                    {/* Botón Back dentro del Drawer (posición absoluta) */}
                    <IconButton
                        onClick={toggleDrawer(false)}
                        sx={{
                            position: "sticky",
                            top: "0px",
                            left: 0,
                            zIndex: 100,
                            backgroundColor: "#fff",
                            boxShadow: 1,
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>

                    {/* Contenido del Drawer */}
                    {songData && <AudioPlayer song={songData} />}

                    {/* Sección de comentarios */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Comentarios</Typography>
                        {/* Aquí puedes agregar input y lista de comentarios */}
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
};

export default SongDrawer;
