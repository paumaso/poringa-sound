import React, { useState } from "react";
import { Box, IconButton, Tooltip, Typography, Drawer, Stack } from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Search from "./Serch";
import GeneroSelect from "./GenerosSelect";
import OrdenSelect from "./OrdenSelect";
import DireccionSelect from "./DireccionSelect";

const Toolbar = ({
  page = 1,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  sx = {},
  showSearch = false,
  showGenero = false,
  showOrden = false,
  showDireccion = false,
  searchValue,
  onSearchChange,
  generoValue,
  onGeneroChange,
  ordenValue,
  onOrdenChange,
  direccionValue,
  onDireccionChange,
  onResetFilters,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtros = (
    <Box sx={{ width: { xs: 280, sm: 340 }, p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1, textAlign: "left" }}>
          Filtros
        </Typography>
        <Tooltip title="Restablecer filtros">
          <IconButton
            onClick={() => {
              onResetFilters && onResetFilters();
            }}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Stack direction="column" spacing={2} sx={{ flex: 1, overflowY: "auto" }}>
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
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        ...sx,
      }}
    >

      <Tooltip title="Filtros">
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <FilterAltIcon />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "16px 0 0 16px" },
            zIndex: 20000,
            width: { xs: 280, sm: 340 },
            maxWidth: "90vw",
          }
        }}
      >
        {filtros}
      </Drawer>

      {/* Paginación */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={onPrevPage}
          disabled={page <= 1}
          size="small"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: 80, textAlign: "center" }}>
          Página {page} de {totalPages}
        </Typography>
        <IconButton
          onClick={onNextPage}
          disabled={page >= totalPages}
          size="small"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Toolbar;