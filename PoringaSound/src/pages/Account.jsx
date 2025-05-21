import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext.jsx";
import useMediaQuery from "@mui/material/useMediaQuery";
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
import AddIcon from "@mui/icons-material/Add";
import UserSongs from "../components/Account/song/UserSongs.jsx";
import UserAlbums from "../components/Account/album/UserAlbums.jsx";
import NewSongDialog from "../components/Account/song/NewSongDialog.jsx";
import NewAlbumDialog from "../components/Account/album/NewAlbumDialog.jsx";

const Account = ({ onEdit, onSongClick }) => {
    const [value, setValue] = useState("two");
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_STORAGE_URL;

    const [openListDialog, setOpenListDialog] = useState(false);
    const [openSongDialog, setOpenSongDialog] = useState(false);
    const [openAlbumDialog, setOpenAlbumDialog] = useState(false);

    const [selectedSong, setSelectedSong] = useState(null);
    const [reloadSongs, setReloadSongs] = useState(false);
    const [reloadAlbums, setReloadAlbums] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        setReloadAlbums(true);
    };

    const handleAlbumsUpdated = () => {
        setReloadAlbums(false);
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
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="primary"
                        indicatorColor="primary"
                    >
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

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            if (value === "two") {
                                setOpenSongDialog(true);
                            } else if (value === "three") {
                                setOpenAlbumDialog(true);
                            }
                        }}
                    >
                        {value === "two" && "New Song"}
                        {value === "three" && "New Album"}
                    </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                    {value === "two" && (
                        <UserSongs
                            userId={user?.id}
                            onSongClick={onSongClick}
                            setOpenSongDialog={setOpenSongDialog}
                            setSelectedSong={setSelectedSong}
                            reloadSongs={reloadSongs}
                            onSongsUpdated={handleSongsUpdated}
                        />
                    )}
                    {value === "three" && (
                        <UserAlbums
                            userId={user?.id}
                            reloadAlbums={reloadAlbums}
                            onAlbumsUpdated={handleAlbumsUpdated}
                        />
                    )}
                </Box>
            </Box>

            <NewSongDialog
                open={openSongDialog}
                onClose={() => setOpenSongDialog(false)}
                onSave={handleSaveSong}
            />
            <NewAlbumDialog
                open={openAlbumDialog}
                onClose={() => setOpenAlbumDialog(false)}
                onSave={handleSaveAlbum}
                userId={user?.id}
            />
        </Box>
    );
};

export default Account;
