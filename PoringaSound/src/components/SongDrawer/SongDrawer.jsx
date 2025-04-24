import React from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const SongDrawer = ({ onDrawerToggle }) => {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
        if (onDrawerToggle) {
            onDrawerToggle(newOpen); // Notifica al componente principal sobre el estado del Drawer
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
                </div>
            </Drawer>
        </div>
    );
};

export default SongDrawer;