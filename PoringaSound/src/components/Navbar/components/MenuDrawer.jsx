import * as React from 'react';
import { useTranslation } from "react-i18next";
import { usePage } from "../../../context/PageContext";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AlbumIcon from '@mui/icons-material/Album';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import logo from "../../../assets/logo.png";

export default function MenuDrawer() {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const { setActivePage } = usePage();

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
                    <ListItemButton onClick={() => setActivePage("home")}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => setActivePage("discover")}>
                        <ListItemIcon>
                            <TravelExploreIcon />
                        </ListItemIcon>
                        <ListItemText primary="Discover" />
                    </ListItemButton>
                </ListItem>

            </List>

            <Divider />

            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setActivePage("songs")}>
                        <ListItemIcon>
                            <MusicNoteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Songs" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setActivePage("albums")}>
                        <ListItemIcon>
                            <AlbumIcon />
                        </ListItemIcon>
                        <ListItemText primary="Albums" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setActivePage("artists")}>
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