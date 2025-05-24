import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
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

import { useAuth } from "../context/AuthContext.jsx";
import { editUser } from "../services/auth.js";

import UserSongs from "../components/Account/song/UserSongs.jsx";
import UserAlbums from "../components/Account/album/UserAlbums.jsx";
import NewSongDialog from "../components/Account/song/NewSongDialog.jsx";
import NewAlbumDialog from "../components/Account/album/NewAlbumDialog.jsx";
import EditAccountDialog from "../components/Account/EditeAcountDialog.jsx";

const Account = ({ onSongClick, onAlbumClick }) => {
    const { user, setUser } = useAuth();
    const apiUrl = import.meta.env.VITE_STORAGE_URL;

    const [value, setValue] = useState("two");
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openSongDialog, setOpenSongDialog] = useState(false);
    const [openAlbumDialog, setOpenAlbumDialog] = useState(false);

    const [selectedSong, setSelectedSong] = useState(null);
    const [reloadSongs, setReloadSongs] = useState(false);
    const [reloadAlbums, setReloadAlbums] = useState(false);

    const theme = useTheme();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    const handleEditAccount = (updatedUser) => {
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setOpenEditDialog(false);
        setReloadSongs(true);
        setReloadAlbums(true);
    };

    const handleSaveSong = () => {
        setOpenSongDialog(false);
        setReloadSongs(true);
    };

    const handleSaveAlbum = () => {
        setOpenAlbumDialog(false);
        setReloadAlbums(true);
    };

    return (
        <Box sx={{ p: 3, position: "relative" }}>
            <IconButton
                onClick={() => setOpenEditDialog(true)}
                size="medium"
                sx={{ position: "absolute", top: 16, right: 16 }}
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

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                mb={2}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{ width: { xs: "100%", sm: "auto" } }}
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
                        value === "two"
                            ? setOpenSongDialog(true)
                            : setOpenAlbumDialog(true);
                    }}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                    {value === "two" ? "New Song" : "New Album"}
                </Button>
            </Stack>

            <Box sx={{ mt: 2 }}>
                {value === "two" && (
                    <UserSongs
                        userId={user?.id}
                        onSongClick={onSongClick}
                        setOpenSongDialog={setOpenSongDialog}
                        setSelectedSong={setSelectedSong}
                        reloadSongs={reloadSongs}
                        onSongsUpdated={() => setReloadSongs(false)}
                    />
                )}
                {value === "three" && (
                    <UserAlbums
                        userId={user?.id}
                        reloadAlbums={reloadAlbums}
                        onAlbumsUpdated={() => setReloadAlbums(false)}
                        onAlbumClick={onAlbumClick}
                    />
                )}
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
            <EditAccountDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                user={user}
                onSave={handleEditAccount}
            />
        </Box>
    );
};

export default Account;
