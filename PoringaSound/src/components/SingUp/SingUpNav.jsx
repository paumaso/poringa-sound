import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logoAzul.png";

function SingUpNav() {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none" }}>
            <Toolbar>
                <IconButton edge="start" sx={{ color: "gray" }} onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>

                <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                    <img src={logo} alt="Logo" style={{ height: "40px" }} />
                </Box>

                <IconButton edge="end" sx={{ color: "gray", marginLeft: "auto" }} onClick={() => alert("Info sobre el registre")}>
                    <InfoIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default SingUpNav;
