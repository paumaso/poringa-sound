import React from "react";
import { 
    Box, 
    InputAdornment, 
    TextField, 
    IconButton 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({
    value,
    onChange,
    placeholder = "Buscar...",
    onClear,
    sx = {},
    ...props
}) => (
    <Box sx={{ width: "100%", ...sx }}>
        <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: value && onClear && (
                    <InputAdornment position="end">
                        <IconButton onClick={onClear} size="small">
                            ✕
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    </Box>
);

export default Search;