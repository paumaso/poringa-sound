import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const opciones = [
    { value: "nombre", label: "Nombre" },
    { value: "artista", label: "Artista" },
    { value: "likes", label: "Más Likes" },
    { value: "interacciones", label: "Más Interacciones" },
];

const OrdenSelect = ({ value, onChange }) => (
    <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
            value={value || "nombre"}
            label="Ordenar por"
            onChange={onChange}
        >
            {opciones.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
        </Select>
    </FormControl>
);

export default OrdenSelect;