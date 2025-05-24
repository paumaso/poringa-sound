import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, IconButton, Drawer, Stack } from "@mui/material";
import Search from "./Serch";
import GeneroSelect from "./GenerosSelect";
import OrdenSelect from "./OrdenSelect";
import DireccionSelect from "./DireccionSelect";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const FiltersPanel = ({
    showSearch = true,
    showGenero = true,
    showOrden = true,
    showDireccion = true,
    searchValue,
    onSearchChange,
    generoValue,
    onGeneroChange,
    ordenValue,
    onOrdenChange,
    direccionValue,
    onDireccionChange,
    sx = {},
}) => {
    const isMobile = useMediaQuery(theme => theme.breakpoints.down("sm"));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const filtros = (
        <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ p: isMobile ? 2 : 0 }}>
            {showSearch && (
                <Search value={searchValue} onChange={onSearchChange} placeholder="Buscar..." />
            )}
            {showGenero && (
                <GeneroSelect value={generoValue} onChange={onGeneroChange} />
            )}
            {showOrden && (
                <OrdenSelect value={ordenValue} onChange={onOrdenChange} />
            )}
            {showDireccion && (
                <DireccionSelect value={direccionValue} onChange={onDireccionChange} />
            )}
        </Stack>
    );

    if (isMobile) {
        return (
            <Box sx={{ ...sx }}>
                <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{
                        color: "inherit",
                        border: "1px solid #1976d2",
                        bgcolor: "white",
                        "&:hover": {
                            color: "white",
                            bgcolor: "#1976d2",
                        },
                        mb: 1
                    }}
                >
                    <FilterAltIcon />
                </IconButton>
                <Drawer
                    anchor="bottom"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    PaperProps={{ sx: { borderRadius: "16px 16px 0 0", zIndex: 20000 } }}
                >
                    {filtros}
                    <Box sx={{ p: 2, textAlign: "right" }}>
                        <IconButton
                            onClick={() => setDrawerOpen(false)}
                            sx={{
                                color: "white",
                                bgcolor: "#1976d2",
                                "&:hover": {
                                    bgcolor: "#115293",
                                },
                            }}
                        >
                            Aplicar
                        </IconButton>
                    </Box>
                </Drawer>
            </Box>
        );
    }

    return (
        <Box sx={{ ...sx }}>
            {filtros}
        </Box>
    );
};

export default FiltersPanel;