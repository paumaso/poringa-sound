import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/material/Typography';

const InfoDropDown = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <li
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={() => setOpen(!open)}
            >
                <Typography variant="h6" color="inherit" component="div">
                    {t('Poringa Sound')}
                </Typography>
                <ExpandMoreIcon
                    className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"
                        }`}
                />
            </li>

            {open && (
                <ul className="absolute left-0 mt-2 w-40 bg-white shadow-lg border rounded-md py-2 z-10">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"><InfoOutlineIcon /> {t('About us')} </li>
                </ul>
            )}
        </div>
    );
};

export default InfoDropDown;
