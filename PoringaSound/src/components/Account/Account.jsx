import React from "react";
import {
    Avatar,
    Box,
    Typography,
    Divider,
    IconButton,
    Stack,
    Tabs,
    Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumIcon from "@mui/icons-material/Album";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { useAuth } from "../../context/AuthContext";
import UserSongs from "./components/UserSongs.jsx";
import UserLists from "./components/UserLists.jsx";
import UserAlbums from "./components/UserAlbums.jsx";

const AccountInfo = ({ onEdit }) => {
    const [value, setValue] = React.useState("one");
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_IMAGES_URL;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    return (
        <Box sx={{ p: 3, position: "relative" }}>
            {/* Botón de editar en esquina superior derecha */}
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

            {/* Tabs */}
            <Box>
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
            </Box>

            {/* Contenido dinámico basado en el tab seleccionado */}
            <Box sx={{ mt: 3 }}>
                {value === "one" && <UserLists userId={user?.id} />}
                {value === "two" && <UserSongs userId={user?.id} />}
                {value === "three" && <UserAlbums userId={user?.id} />}
            </Box>
        </Box>
    );
};

export default AccountInfo;