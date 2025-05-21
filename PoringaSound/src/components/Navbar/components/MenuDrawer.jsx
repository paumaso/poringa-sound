import * as React from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import {
    Box,
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Typography,
    Tooltip
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AlbumIcon from '@mui/icons-material/Album';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

import logo from "../../../assets/logo.png";

export default function MenuDrawer({ onOpenAuthModal }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const { isAuthenticated } = useAuth();


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                <img src={logo} alt="Logo" style={{ height: 40, marginRight: 8 }} />
                <Typography variant="h6" component="div">
                    {t('Poringa Sound')}
                </Typography>
            </Box>
            <Divider />

            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/")}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    {isAuthenticated ? (
                        <ListItemButton onClick={() => navigate("/discover")}>
                            <ListItemIcon>
                                <TravelExploreIcon />
                            </ListItemIcon>
                            <ListItemText primary={t("Descubrir")} />
                        </ListItemButton>
                    ) : (
                        <Tooltip title="Solo para usuarios con sesión iniciada" arrow>
                            <ListItemButton
                                onClick={e => {
                                    e.preventDefault();
                                    if (onOpenAuthModal) onOpenAuthModal("login");
                                }}
                                sx={{ opacity: 0.7 }}
                            >
                                <ListItemIcon>
                                    <TravelExploreIcon />
                                </ListItemIcon>
                                <ListItemText primary={t("Descubrir")} />
                            </ListItemButton>
                        </Tooltip>
                    )}
                </ListItem>

            </List>

            <Divider />

            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/songs")}>
                        <ListItemIcon>
                            <MusicNoteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Songs" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/albums")}>
                        <ListItemIcon>
                            <AlbumIcon />
                        </ListItemIcon>
                        <ListItemText primary="Albums" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/artists")}>
                        <ListItemIcon>
                            <PeopleAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="Artists" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton onClick={toggleDrawer(true)} size="large" aria-label="menu" color="inherit">
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}