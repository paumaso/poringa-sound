import React, { useState } from "react";
import {
    Avatar,
    Box,
    Typography,
    Divider,
    IconButton,
    Stack,
    Tabs,
    Tab,
    Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumIcon from "@mui/icons-material/Album";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";
import UserSongs from "./components/song/UserSongs.jsx";
import UserLists from "./components/list/UserLists.jsx";
import UserAlbums from "./components/album/UserAlbums.jsx";
import NewSongDialog from "./components/song/NewSongDialog.jsx";
import NewAlbumDialog from "./components/album/NewAlbumDialog.jsx";
import NewListDialog from "./components/list/NewListDialog.jsx";

const Account = ({ onEdit, onSongClick }) => {
    const [value, setValue] = useState("one");
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_STORAGE_URL;
    const [openListDialog, setOpenListDialog] = useState(false);
    const [openSongDialog, setOpenSongDialog] = useState(false);
    const [openAlbumDialog, setOpenAlbumDialog] = useState(false);
    
    const [selectedSong, setSelectedSong] = useState(null);
    const [reloadSongs, setReloadSongs] = useState(false);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    const handleSaveList = async () => {
        setOpenListDialog(false);
    };

    const handleSaveSong = async () => {
        setOpenSongDialog(false);
        setReloadSongs(true);
    };

    const handleSongsUpdated = () => {
        setReloadSongs(false);
    };

    const handleSaveAlbum = async () => {
        setOpenAlbumDialog(false);
    };

    return (
        <Box sx={{ p: 3, position: "relative" }}>
            <IconButton
                onClick={onEdit}
                size="medium"
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                }}
            >
                <EditIcon />
            </IconButton>

            {/* Contenido principal */}
            <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                    src={user?.imagen_perfil ? apiUrl + user.imagen_perfil : ""}
                    sx={{
                        bgcolor: user?.imagen_perfil ? "transparent" : "primary.main",
                        width: 100,
                        height: 100,
                        border: "3px solid",
                        borderColor: "divider",
                        fontSize: 60,
                    }}
                >
                    {!user?.imagen_perfil && getInitial(user?.nombre)}
                </Avatar>

                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {user?.nombre || "Usuario"}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {user?.email || "correo@ejemplo.com"}
                    </Typography>
                </Box>
            </Stack>

            {/* Divider */}
            <Divider sx={{ my: 2 }} />

            <Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    {/* Tabs alineados a la izquierda */}
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab
                            value="one"
                            label={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <QueueMusicIcon />
                                    <Typography>Listas</Typography>
                                </Box>
                            }
                        />
                        <Tab
                            value="two"
                            label={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <MusicNoteIcon />
                                    <Typography>Songs</Typography>
                                </Box>
                            }
                        />
                        <Tab
                            value="three"
                            label={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <AlbumIcon />
                                    <Typography>Albums</Typography>
                                </Box>
                            }
                        />
                    </Tabs>

                    {/* Botón alineado a la derecha */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            if (value === "one") {
                                setOpenListDialog(true);
                            } else if (value === "two") {
                                setOpenSongDialog(true);
                            } else if (value === "three") {
                                setOpenAlbumDialog(true);
                            }
                        }}
                    >
                        {value === "one" && "New List"}
                        {value === "two" && "New Song"}
                        {value === "three" && "New Album"}
                    </Button>
                </Box>

                {/* Contenido dinámico basado en el tab seleccionado */}
                <Box sx={{ mt: 2 }}>
                    {value === "one" && <UserLists userId={user?.id} />}
                    {value === "two" && (
                        <UserSongs
                            userId={user?.id}
                            onSongClick={onSongClick}
                            setOpenSongDialog={setOpenSongDialog}
                            setSelectedSong={setSelectedSong}
                        />
                    )}
                    {value === "three" && <UserAlbums userId={user?.id} />}
                </Box>
            </Box>

            {/* Modals */}
            <NewListDialog
                open={openListDialog}
                onClose={() => setOpenListDialog(false)}
                onSave={handleSaveList}
            />
            <NewSongDialog
                open={openSongDialog}
                onClose={() => setOpenSongDialog(false)}
                onSave={handleSaveSong}
            />
            <NewAlbumDialog
                open={openAlbumDialog}
                onClose={() => setOpenAlbumDialog(false)}
                onSave={handleSaveAlbum}
            />
        </Box>
    );
};

export default Account;