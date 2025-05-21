import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { fetchGeneros } from "../../services/songs";

const GeneroSelect = ({ value, onChange }) => {
    const [generos, setGeneros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGeneros = async () => {
            try {
                const data = await fetchGeneros();
                setGeneros(data.generos || data);
            } catch (e) {
                setGeneros([]);
            } finally {
                setLoading(false);
            }
        };
        loadGeneros();
    }, []);

    return (
        <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Género</InputLabel>
            <Select
                value={value || ""}
                label="Género"
                onChange={onChange}
                disabled={loading}
            >
                <MenuItem value="">Todos</MenuItem>
                {generos.map(g => (
                    <MenuItem key={g.id} value={g.id}>{g.nombre}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default GeneroSelect;