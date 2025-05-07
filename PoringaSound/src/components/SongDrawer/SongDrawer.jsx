import React from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const SongDrawer = ({ open, onDrawerToggle, songData }) => {
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    
    const toggleDrawer = (newOpen) => () => {
        if (onDrawerToggle) {
            onDrawerToggle(newOpen);
        }
    };

    return (
        <div>
            {/* Botón para abrir el Drawer */}
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
                        zIndex: 1000,
                    }}
                >
                    <MusicNoteIcon />
                </Button>
            )}

            {/* Drawer lateral persistente */}
            <Drawer
                anchor="right"
                open={open}
                variant="persistent"
                sx={{
                    "& .MuiDrawer-paper": {
                        width: "400px",
                        padding: "20px",
                        top: "74px",
                        height: "calc(100% - 74px)",
                    },
                }}
            >
                <div>
                    <IconButton
                        onClick={toggleDrawer(false)}
                        sx={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    {songData && (
                        <div>
                            <img
                                src={apiUrl + songData.portada}
                                alt={songData.titulo}
                                style={{ width: "100%", borderRadius: "10px" }}
                            />
                            <h2>{songData.titulo}</h2>
                        </div>
                    )}
                </div>
            </Drawer>
        </div>
    );
};

export default SongDrawer;