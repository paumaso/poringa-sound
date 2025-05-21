import { IconButton, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const InfoButton = ({ onClick, label = "Ver detalles", size = "small", color = "primary" }) => {
    return (
        <Tooltip title={label} arrow>
            <IconButton
                onClick={onClick}
                size={size}
                sx={{
                    color: `#000`,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        color: `${color}.main`,
                    }
                }}
            >
                <InfoOutlinedIcon fontSize="inherit" />
            </IconButton>
        </Tooltip>
    );
};

export default InfoButton;
