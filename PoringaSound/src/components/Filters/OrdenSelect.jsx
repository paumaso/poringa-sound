import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import PersonIcon from "@mui/icons-material/Person";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WhatshotIcon from "@mui/icons-material/Whatshot";

const opciones = [
    { value: "nombre", label: "Nombre"},
    { value: "artista", label: "Artista"},
    { value: "likes", label: "Más Likes" },
    { value: "interacciones", label: "Más Interacciones" },
];

const OrdenSelect = ({ value, onChange }) => (
    <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
            value={value || "nombre"}
            label="Ordenar por"
            onChange={onChange}
            sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                fontWeight: 500,
            }}
        >
            {opciones.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {opt.icon}
                        {opt.label}
                    </Box>
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

export default OrdenSelect;