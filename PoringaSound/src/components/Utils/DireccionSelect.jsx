import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const opciones = [
    { value: "asc", label: "Ascendente" },
    { value: "desc", label: "Descendente" },
];

const DireccionSelect = ({ value, onChange }) => (
    <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Dirección</InputLabel>
        <Select
            value={value || "asc"}
            label="Dirección"
            onChange={onChange}
        >
            {opciones.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
        </Select>
    </FormControl>
);

export default DireccionSelect;