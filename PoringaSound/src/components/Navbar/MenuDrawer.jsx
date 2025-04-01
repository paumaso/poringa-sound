import * as React from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import logo from "../../assets/logoAzul.png";

export default function MenuDrawer() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [open, setOpen] = React.useState(false);

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
                    <ListItemButton onClick={() => navigate('/default')}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />

            {/* Otros elementos */}
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
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