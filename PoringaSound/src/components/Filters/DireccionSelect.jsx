import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const opciones = [
    { value: "asc", label: "Ascendente", icon: <ArrowUpwardIcon fontSize="small" sx={{ mr: 1 }} /> },
    { value: "desc", label: "Descendente", icon: <ArrowDownwardIcon fontSize="small" sx={{ mr: 1 }} /> },
];

const DireccionSelect = ({ value, onChange }) => (
    <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Orden</InputLabel>
        <Select
            value={value || "asc"}
            label="Orden"
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

export default DireccionSelect;