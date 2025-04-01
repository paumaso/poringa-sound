import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const InfoDropDown = () => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className="relative inline-block">
            <div
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={handleClick}
                aria-controls="info-menu"
                aria-haspopup="true"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
            >
                <Typography variant="h6" color="inherit" component="div">
                    {t('Poringa Sound')}
                </Typography>
                <ExpandMoreIcon
                    className={`text-gray-500 transition-transform duration-200 ${anchorEl ? "rotate-180" : "rotate-0"}`}
                />
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <MenuItem sx={{ minWidth: 200 }}>
                    <InfoOutlineIcon /> {t('About us')}
                </MenuItem>
            </Menu>
        </div>
    );
};

export default InfoDropDown;
